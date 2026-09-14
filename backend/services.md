# RasoiGrid Intelligence Services

RasoiGrid uses a modular intelligence layer to support food-surplus
prediction, rescue coordination, circular recovery, and impact tracking.

## 1. Surplus Intelligence

File:

`app/services/surplus.py`

Calculates:

- Surplus score
- Surplus risk
- Urgency
- Estimated hours remaining

This is a planning tool and does not determine food safety.

---

## 2. NGO Matching

File:

`app/services/matching.py`

Ranks verified NGOs using:

- Distance from donation
- Available capacity
- Verification status

The result provides a match score and ranked NGO list.

---

## 3. Volunteer Ranking

File:

`app/services/volunteer.py`

Ranks available volunteers using:

- Distance from pickup location
- Availability
- Vehicle availability

---

## 4. Impact Engine

File:

`app/services/impact.py`

Calculates configurable impact estimates such as:

- Rescued food
- Estimated meals supported
- Organic recovery
- Total recovered material
- Rescue success rate

Impact values are estimates and should not be presented as measured
real-world outcomes unless verified.

---

## 5. Priority Engine

File:

`app/services/priority.py`

Combines:

- Surplus score
- Urgency
- NGO distance
- NGO capacity

into a single priority score:

- LOW
- MEDIUM
- HIGH
- CRITICAL

---

## 6. Circular Recovery Engine

File:

`app/services/recovery.py`

Follows the RasoiGrid recovery principle:

**PEOPLE FIRST → CIRCULAR RECOVERY → LANDFILL LAST**

The service does not make food-safety decisions.

---

## 7. Decision Pipeline

File:

`app/services/decision.py`

Combines surplus, recovery, and priority intelligence into one
RasoiGrid decision.

---

## 8. Recommendation Layer

File:

`app/services/recommendation.py`

Produces a clean structured recommendation that can later be consumed
by the frontend.

---

## 9. Audit Service

File:

`app/services/audit.py`

Creates structured workflow events such as:

DONATED → MATCHED → REQUESTED → ACCEPTED → DISPATCHED → PICKED_UP → DELIVERED

This supports digital traceability and chain-of-custody records.

---

## 10. Configuration

File:

`app/services/config.py`

Stores configurable thresholds for:

- Quantity
- Urgency
- Distance
- Impact estimates

Keeping these values centralized makes the intelligence layer easier
to maintain and tune.

---

## Testing

Automated tests are stored under:

`tests/services/`

The intelligence services are tested independently before being
connected to API routes.