import os
import json

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


def generate_ai_prediction(
    food_category: str,
    quantity: float,
    unit: str,
    prepared_at: str,
    consume_before: str
):
    """
    Generate an AI-based planning recommendation for food surplus.

    Gemini provides prediction and prioritization assistance.
    It does not determine food safety.
    """

    prompt = f"""
You are the AI prediction engine for RasoiGrid,
an urban food surplus management platform.

Analyze this food surplus information:

Food category: {food_category}
Quantity: {quantity} {unit}
Prepared at: {prepared_at}
Consume before: {consume_before}

Return ONLY a valid JSON object.

The JSON must contain exactly these fields:

surplus_risk
urgency
recommended_action
explanation

surplus_risk must be exactly one of:

LOW, MEDIUM, HIGH

urgency must be exactly one of:

LOW, MEDIUM, HIGH

Do not claim that the food is microbiologically safe or unsafe.

AI is only providing a planning and prioritization recommendation.

Food safety decisions must remain with authorized human
food-safety personnel.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )

        if not response.text:
            raise ValueError("Gemini returned an empty response")

        result = json.loads(response.text)

        return {
            "surplus_risk": result["surplus_risk"],
            "urgency": result["urgency"],
            "recommended_action": result["recommended_action"],
            "explanation": result["explanation"]
        }

    except Exception:
        # Safe fallback if Gemini is temporarily unavailable

        if quantity >= 50:
            surplus_risk = "HIGH"
            urgency = "HIGH"
            recommended_action = (
                "Alert verified rescue organizations immediately"
            )
            explanation = (
                "The reported quantity is large and may require "
                "immediate rescue coordination."
            )

        elif quantity >= 20:
            surplus_risk = "MEDIUM"
            urgency = "MEDIUM"
            recommended_action = (
                "Prepare rescue matching and pickup planning"
            )
            explanation = (
                "The reported quantity may require coordinated "
                "redistribution."
            )

        else:
            surplus_risk = "LOW"
            urgency = "LOW"
            recommended_action = (
                "Monitor surplus and prepare local recovery options"
            )
            explanation = (
                "The reported quantity is relatively small."
            )

        return {
            "surplus_risk": surplus_risk,
            "urgency": urgency,
            "recommended_action": recommended_action,
            "explanation": explanation
        }