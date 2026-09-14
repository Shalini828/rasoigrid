from math import radians, sin, cos, sqrt, atan2

from app.services.config import (
    NEAR_DISTANCE_KM,
    MEDIUM_DISTANCE_KM,
    FAR_DISTANCE_KM,
)


def calculate_distance(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float
) -> float:
    """Calculate approximate distance between two coordinates in km."""

    earth_radius = 6371

    lat1 = radians(latitude1)
    lat2 = radians(latitude2)

    delta_lat = radians(latitude2 - latitude1)
    delta_lon = radians(longitude2 - longitude1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c


def rank_volunteers(
    pickup_latitude: float,
    pickup_longitude: float,
    volunteers: list
):
    """
    Rank available volunteers for a pickup.

    Higher score = better pickup candidate.
    """

    matches = []

    for volunteer in volunteers:

        # Only available volunteers
        if volunteer.availability_status != "AVAILABLE":
            continue

        # Coordinates are required
        if volunteer.latitude is None or volunteer.longitude is None:
            continue

        distance = calculate_distance(
            pickup_latitude,
            pickup_longitude,
            volunteer.latitude,
            volunteer.longitude
        )

        score = 100

        # Distance factor
        if distance <= NEAR_DISTANCE_KM:
            score += 20
        elif distance <= MEDIUM_DISTANCE_KM:
            score += 10
        elif distance <= FAR_DISTANCE_KM:
            score += 0
        else:
            score -= 20

        # Vehicle availability factor
        if volunteer.vehicle_type:
            score += 10

        # Keep score between 0 and 100
        score = max(0, min(score, 100))

        matches.append({
            "volunteer_id": volunteer.id,
            "distance_km": round(distance, 2),
            "vehicle_type": volunteer.vehicle_type,
            "match_score": score
        })

    # Highest scoring volunteer first
    matches.sort(
        key=lambda match: match["match_score"],
        reverse=True
    )

    return matches