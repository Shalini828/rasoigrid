import os
import json

from dotenv import load_dotenv
from google import genai

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.ai_prediction import generate_ai_prediction


load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
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
    result = generate_ai_prediction(
        food_category=request.food_category,
        quantity=request.quantity,
        unit=request.unit,
        prepared_at=request.prepared_at,
        consume_before=request.consume_before
    )

    return PredictionResponse(
        surplus_risk=result["surplus_risk"],
        urgency=result["urgency"],
        recommended_action=result["recommended_action"],
        explanation=result["explanation"]
    )