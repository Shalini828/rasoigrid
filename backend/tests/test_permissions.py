import sys
import types


# Provide a lightweight Gemini stub during tests.
# The permission tests do not call Gemini.
fake_genai = types.ModuleType("google.genai")


class FakeClient:
    def __init__(self, *args, **kwargs):
        pass


fake_genai.Client = FakeClient

fake_google = types.ModuleType("google")
fake_google.genai = fake_genai
fake_google.__path__ = []


sys.modules["google"] = fake_google
sys.modules["google.genai"] = fake_genai


from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_unauthenticated_user_cannot_create_donation():
    """
    A user without authentication must not be allowed
    to create a donation.
    """

    response = client.post(
        "/api/donations/",
        json={
            "food_name": "Test Food",
            "food_category": "COOKED MEALS",
            "quantity": 10,
            "unit": "kg",
            "prepared_at": "2026-09-14T10:00:00",
            "consume_before": "2026-09-14T18:00:00",
            "storage_condition": "REFRIGERATED",
            "packaging_available": True,
            "pickup_required": True,
            "latitude": 28.61,
            "longitude": 77.21
        }
    )

    assert response.status_code == 401


def test_ngo_cannot_create_donation():
    """
    An authenticated NGO user must not be allowed
    to create a donation.
    """

    from app.dependencies.auth import get_current_user
    from app.models.user import User

    fake_ngo_user = User(
        id=999,
        name="Test NGO",
        email="ngo-test@rasoigrid.com",
        phone="9999999999",
        password_hash="test-password",
        role="NGO"
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_ngo_user
    )

    try:
        response = client.post(
            "/api/donations/",
            json={
                "food_name": "Test Food",
                "food_category": "COOKED MEALS",
                "quantity": 10,
                "unit": "kg",
                "prepared_at": "2026-09-14T10:00:00",
                "consume_before": "2026-09-14T18:00:00",
                "storage_condition": "REFRIGERATED",
                "packaging_available": True,
                "pickup_required": True,
                "latitude": 28.61,
                "longitude": 77.21
            }
        )

        assert response.status_code == 403
        assert response.json()["detail"] == (
            "Only donors can create donations"
        )

    finally:
        app.dependency_overrides.clear()


def test_donor_cannot_create_ngo():
    """
    An authenticated DONOR user must not be allowed
    to create an NGO profile.
    """

    from app.dependencies.auth import get_current_user
    from app.models.user import User

    fake_donor_user = User(
        id=998,
        name="Test Donor",
        email="donor-test@rasoigrid.com",
        phone="9999999998",
        password_hash="test-password",
        role="DONOR"
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_donor_user
    )

    try:
        response = client.post(
            "/api/ngos/",
            json={
                "organization_name": "Test NGO",
                "address": "Test Address",
                "latitude": 28.61,
                "longitude": 77.21,
                "capacity": 100
            }
        )

        assert response.status_code == 403
        assert response.json()["detail"] == (
            "Only NGO users can create NGO profiles"
        )

    finally:
        app.dependency_overrides.clear()


def test_donor_cannot_create_volunteer():
    """
    An authenticated DONOR user must not be allowed
    to create a volunteer profile.
    """

    from app.dependencies.auth import get_current_user
    from app.models.user import User

    fake_donor_user = User(
        id=997,
        name="Test Donor",
        email="donor-volunteer-test@rasoigrid.com",
        phone="9999999997",
        password_hash="test-password",
        role="DONOR"
    )

    app.dependency_overrides[get_current_user] = (
        lambda: fake_donor_user
    )

    try:
        response = client.post(
            "/api/volunteers/",
            json={
                "vehicle_type": "BIKE",
                "latitude": 28.61,
                "longitude": 77.21
            }
        )

        assert response.status_code == 403
        assert response.json()["detail"] == (
            "Only volunteer users can create volunteer profiles"
        )

    finally:
        app.dependency_overrides.clear()

def test_unauthenticated_user_cannot_create_ngo():
    """
    A user without authentication must not be allowed
    to create an NGO profile.
    """

    response = client.post(
        "/api/ngos/",
        json={
            "organization_name": "Test NGO",
            "address": "Test Address",
            "latitude": 28.61,
            "longitude": 77.21,
            "capacity": 100
        }
    )

    assert response.status_code == 401

def test_health_endpoint():
    """
    The health endpoint should confirm that the API is running.
    """

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "healthy",
        "service": "RasoiGrid API"
    }