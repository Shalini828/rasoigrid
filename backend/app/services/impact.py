from app.services.config import KG_PER_ESTIMATED_MEAL


def calculate_impact(
    rescued_food_kg: float,
    organic_recovery_kg: float = 0,
    successful_rescues: int = 0,
    total_donations: int = 0
):
    """
    Calculate estimated social and environmental impact.

    These are configurable planning estimates,
    not measured real-world outcomes.
    """

    # Estimated meals supported
    estimated_meals = rescued_food_kg / KG_PER_ESTIMATED_MEAL

    # Rescue success rate
    if total_donations > 0:
        rescue_rate = (
            successful_rescues / total_donations
        ) * 100
    else:
        rescue_rate = 0

    # Total material recovered
    total_recovered_kg = (
        rescued_food_kg + organic_recovery_kg
    )

    return {
        "rescued_food_kg": round(rescued_food_kg, 2),
        "estimated_meals_supported": round(estimated_meals),
        "organic_recovery_kg": round(organic_recovery_kg, 2),
        "total_recovered_kg": round(total_recovered_kg, 2),
        "successful_rescues": successful_rescues,
        "total_donations": total_donations,
        "rescue_rate_percent": round(rescue_rate, 2)
    }