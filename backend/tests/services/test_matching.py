from app.services.matching import calculate_distance, rank_ngos


class TestNGO:
    def __init__(self, id, name, lat, lon, capacity, status):
        self.id = id
        self.organization_name = name
        self.latitude = lat
        self.longitude = lon
        self.capacity = capacity
        self.verification_status = status


def test_distance_calculation():
    distance = calculate_distance(
        28.6139,
        77.2090,
        28.6200,
        77.2100
    )

    assert distance > 0
    assert distance < 2


def test_unverified_ngo_is_excluded():
    ngos = [
        TestNGO(
            1,
            "Verified NGO",
            28.6200,
            77.2100,
            100,
            "VERIFIED"
        ),
        TestNGO(
            2,
            "Unverified NGO",
            28.6150,
            77.2200,
            200,
            "PENDING"
        )
    ]

    result = rank_ngos(
        28.6139,
        77.2090,
        50,
        ngos
    )

    assert len(result) == 1
    assert result[0]["ngo_id"] == 1