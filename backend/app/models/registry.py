"""
Imports every model so SQLAlchemy (and Alembic) know about all tables.

Import this module wherever the full schema is needed, instead of
listing each model again.
"""

from app.models.user import User  # noqa: F401
from app.models.donor import DonorProfile  # noqa: F401
from app.models.ngo import NGOProfile  # noqa: F401
from app.models.volunteer import VolunteerProfile  # noqa: F401
from app.models.donation import Donation  # noqa: F401
from app.models.rescue_request import RescueRequest  # noqa: F401
from app.models.dispatch import Dispatch  # noqa: F401
from app.models.impact import ImpactRecord  # noqa: F401
from app.models.audit import AuditEvent  # noqa: F401
from app.models.delivery_code import DeliveryCode  # noqa: F401
from app.models.safety_check import DonationSafetyCheck  # noqa: F401
from app.models.notification import Notification  # noqa: F401
