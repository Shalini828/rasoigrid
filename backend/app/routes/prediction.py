import os
from google import genai
from dotenv import load_dotenv

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.dependencies.auth import get_current_user
from app.models.user import User

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
router = APIRouter(
    prefix="/api/predictions",
    tags=["Predictions"]
)


class PredictionRequest(BaseModel):
    food_category: str
    quantity: float
    unit: str
    prepared_at: str
    consume_before: str


class PredictionResponse(BaseModel):
    surplus_risk: str
    urgency: str
    recommended_action: str
    explanation: str


@router.post("/", response_model=PredictionResponse)
def predict_surplus(
    request: PredictionRequest,
    current_user: User = Depends(get_current_user)
):
    prompt = f"""
    You are the AI prediction engine for RasoiGrid, an urban food surplus
    management platform.

    Analyze this food surplus information:

    Food category: {request.food_category}
    Quantity: {request.quantity} {request.unit}
    Prepared at: {request.prepared_at}
    Consume before: {request.consume_before}

    Return ONLY valid JSON with exactly these fields:
    surplus_risk
    urgency
    recommended_action
    explanation

    surplus_risk must be LOW, MEDIUM, or HIGH.
    urgency must be LOW, MEDIUM, or HIGH.

    Do not claim that the food is microbiologically safe or unsafe.
    AI should provide a planning recommendation only.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    import json

    result = json.loads(response.text)

    return PredictionResponse(
        surplus_risk=result["surplus_risk"],
        urgency=result["urgency"],
        recommended_action=result["recommended_action"],
        explanation=result["explanation"]
    )
    # Gemini will be connected in the next step.

    if request.quantity >= 50:
        surplus_risk = "HIGH"
        urgency = "HIGH"
        recommended_action = "Alert verified rescue organizations immediately"
        explanation = "Large food quantity indicates a high probability of surplus."

    elif request.quantity >= 20:
        surplus_risk = "MEDIUM"
        urgency = "MEDIUM"
        recommended_action = "Prepare rescue matching and pickup planning"
        explanation = "The reported quantity may require coordinated redistribution."

    else:
        surplus_risk = "LOW"
        urgency = "LOW"
        recommended_action = "Monitor surplus and prepare local recovery options"
        explanation = "The reported quantity is relatively small."

    return PredictionResponse(
        surplus_risk=surplus_risk,
        urgency=urgency,
        recommended_action=recommended_action,
        explanation=explanation
    )