from app.services.volunteer import rank_volunteers


class TestVolunteer:
    def __init__(self, id, lat, lon, vehicle, status):
        self.id = id
        self.latitude = lat
        self.longitude = lon
        self.vehicle_type = vehicle
        self.availability_status = status


def test_unavailable_volunteer_is_excluded():
    volunteers = [
        TestVolunteer(
            1,
            28.6200,
            77.2100,
            "BIKE",
            "AVAILABLE"
        ),
        TestVolunteer(
            2,
            28.6150,
            77.2200,
            "BIKE",
            "UNAVAILABLE"
        )
    ]

    result = rank_volunteers(
        28.6139,
        77.2090,
        volunteers
    )

    assert len(result) == 1
    assert result[0]["volunteer_id"] == 1


def test_nearest_volunteer_ranks_first():
    volunteers = [
        TestVolunteer(
            1,
            28.7000,
            77.3000,
            "CAR",
            "AVAILABLE"
        ),
        TestVolunteer(
            2,
            28.6150,
            77.2100,
            "BIKE",
            "AVAILABLE"
        )
    ]

    result = rank_volunteers(
        28.6139,
        77.2090,
        volunteers
    )

    assert result[0]["volunteer_id"] == 2