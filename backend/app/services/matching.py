from math import radians, sin, cos, sqrt, atan2


def calculate_distance(
    latitude1: float,
    longitude1: float,
    latitude2: float,
    longitude2: float
) -> float:
    """
    Calculate approximate distance between two coordinates in kilometers.
    """

    earth_radius = 6371

    lat1 = radians(latitude1)
    lat2 = radians(latitude2)

    delta_lat = radians(latitude2 - latitude1)
    delta_lon = radians(longitude2 - longitude1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1) * cos(lat2) * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius * c


def rank_ngos(
    donation_latitude: float,
    donation_longitude: float,
    donation_quantity: float,
    ngos: list
):
    """
    Rank verified NGOs for a donation.

    Higher score = better match.

    This is a routing/planning recommendation,
    not a food-safety decision.
    """

    matches = []

    for ngo in ngos:

        if ngo.verification_status != "VERIFIED":
            continue

        if ngo.capacity <= 0:
            continue

        if ngo.latitude is None or ngo.longitude is None:
            continue

        distance = calculate_distance(
            donation_latitude,
            donation_longitude,
            ngo.latitude,
            ngo.longitude
        )

        score = 100

        # Distance penalty
        if distance <= 2:
            score += 20
        elif distance <= 5:
            score += 10
        elif distance <= 10:
            score += 0
        else:
            score -= 20

        # Capacity factor
        if ngo.capacity >= donation_quantity:
            score += 20
        else:
            score -= 20

        matches.append({
            "ngo_id": ngo.id,
            "organization_name": ngo.organization_name,
            "distance_km": round(distance, 2),
            "capacity": ngo.capacity,
            "match_score": max(0, min(score, 100))
        })

    matches.sort(
        key=lambda match: match["match_score"],
        reverse=True
    )

    return matches