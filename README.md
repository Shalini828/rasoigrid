# RasoiGrid

RasoiGrid connects kitchens that have surplus food with NGOs and volunteers who can deliver it before it spoils.

- **Donors** (restaurants, caterers, canteens) list surplus food with its quantity, timing, pickup location and a short food-safety checklist.
- **NGOs**, once verified by an admin, see available food (most urgent first), claim it, and dispatch the best-matched available volunteer.
- **Volunteers** mark each pickup as collected, then delivered. To mark it delivered they enter the NGO's 6-digit **handover code**, which proves the NGO received the food.
- **Admins** verify NGOs and see every user, the audit trail, and live network figures.

Every step is recorded in an audit log, and delivered food counts toward impact totals. Each person gets **in-app notifications** (the bell in the top bar) when their food moves: NGOs hear about new food, donors when it is claimed, collected and delivered, and volunteers when they are given a pickup.

Each donation gets a planning **priority** (LOW to CRITICAL, with a 0–100 score) from the rules in `backend/app/services`: quantity, time left before its consume-before time, and, for an NGO, its distance and capacity. It also gets a suggested **recovery path**: people first, then composting or other circular recovery, landfill last. These scores help decide what to pick up first; they do not certify food safety.

Donations nobody claims before their consume-before time are marked **Expired** automatically and leave the NGOs' list.

```
backend/   FastAPI + SQLAlchemy API (Python)
frontend/  React + TypeScript + Vite app
```

## Running it locally

You need Python 3.11+ and Node.js 20+. PostgreSQL is recommended, but SQLite works for trying it out.

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env
uvicorn app.main:app --reload
```

The API runs at http://127.0.0.1:8000, with interactive docs at http://127.0.0.1:8000/docs. Locally, missing tables are created automatically on start. See [Database migrations](#database-migrations) for how schema changes reach existing and deployed databases.

Create the admin account (it uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`):

```bash
python create_admin.py
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

### 3. Try the full flow

1. Register a **donor**, an **NGO** and a **volunteer** (use three different emails).
2. Log in as the NGO and fill in the NGO profile. Log in as the volunteer and fill in the volunteer profile.
3. Log in as the admin, open **NGO Verification**, and verify the NGO.
4. As the donor, log a surplus. Use **Use my current location**, or type the coordinates.
5. As the NGO, open **Command**, select the donation, and click **Claim & dispatch nearest volunteer**. Note the handover code on the pickup card.
6. As the volunteer, open **Logistics**, mark the pickup as picked up, then enter the NGO's handover code and mark it delivered.
7. The donor's dashboard and history now show it as delivered.

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

`tests/test_rescue_flow.py` runs the whole donor → NGO → volunteer flow through the API. Tests use whatever `DATABASE_URL` points to, so use a throwaway database, e.g. `DATABASE_URL=sqlite:///./test.db pytest`.

GitHub Actions (`.github/workflows/ci.yml`) runs on every pull request and every push to `main`: backend tests, a check that the migrations build the full schema, and the frontend lint and build.

## Database migrations

Schema changes go through [Alembic](https://alembic.sqlalchemy.org). Run these from `backend/`, with `DATABASE_URL` set:

| Situation | Command |
|---|---|
| New, empty database | `alembic upgrade head` |
| Database created before migrations existed (by running the app) | `alembic stamp 0001` then `alembic upgrade head` |
| After pulling changes | `alembic upgrade head` |
| You changed a model | `alembic revision --autogenerate -m "what changed"`, read the file it writes in `alembic/versions/`, then `alembic upgrade head` |

On a server, set `AUTO_CREATE_TABLES=false` and start the API with `start.sh`, which runs `alembic upgrade head` first.

## Configuration

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | backend | Database connection string (required) |
| `JWT_SECRET_KEY` | backend | Signs login tokens (required) |
| `FRONTEND_URL` | backend | Origins allowed by CORS, comma-separated (default `http://localhost:5173`) |
| `AUTO_CREATE_TABLES` | backend | `true` (default) creates missing tables on start; `false` on servers that use migrations |
| `GEMINI_API_KEY` | backend | Optional; enables Gemini surplus forecasts |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | backend | Used by `create_admin.py` |
| `VITE_API_URL` | frontend | API address (default `http://127.0.0.1:8000`) |

## Current limitations

- Forecast, receiver hubs and circular recovery still show sample data. They have no backend endpoints yet. The Forecast page says so on screen.
- `POST /api/predictions` (Gemini, with a rule-based fallback) works but isn't used by the frontend yet. Forecasting needs weeks of real donation history first.
- Five wrong handover codes lock the code; the NGO can then confirm delivery from their side.
- The food-safety checklist is the donor's declaration, not an inspection. The receiving NGO still decides before serving.
- Notifications are in the app only. There is no email or SMS yet, and the bell checks for new ones every 30 seconds.
- Volunteer distances are straight-line kilometres, not road distance.
