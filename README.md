# RasoiGrid

RasoiGrid connects kitchens that have surplus food with NGOs and volunteers who can deliver it before it spoils.

- **Donors** (restaurants, caterers, canteens) list surplus food with its quantity, timing and pickup location.
- **NGOs**, once verified by an admin, see available food (most urgent first), claim it, and dispatch the best-matched available volunteer.
- **Volunteers** mark each pickup as collected, then delivered.
- **Admins** verify NGOs.

Every step is recorded in an audit log, and delivered food counts toward impact totals.

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

The API runs at http://127.0.0.1:8000, with interactive docs at http://127.0.0.1:8000/docs. Tables are created automatically on first start.

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
5. As the NGO, open **Command**, select the donation, and click **Claim & dispatch nearest volunteer**.
6. As the volunteer, open **Logistics** and mark the pickup as picked up, then delivered.
7. The donor's dashboard and history now show it as delivered.

## Tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest
```

`tests/test_rescue_flow.py` runs the whole donor → NGO → volunteer flow through the API. Tests use whatever `DATABASE_URL` points to, so use a throwaway database, e.g. `DATABASE_URL=sqlite:///./test.db pytest`.

## Configuration

| Variable | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | backend | Database connection string (required) |
| `JWT_SECRET_KEY` | backend | Signs login tokens (required) |
| `FRONTEND_URL` | backend | Origin allowed by CORS (default `http://localhost:5173`) |
| `GEMINI_API_KEY` | backend | Optional; enables Gemini surplus forecasts |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | backend | Used by `create_admin.py` |
| `VITE_API_URL` | frontend | API address (default `http://127.0.0.1:8000`) |

## Current limitations

- Forecast, receiver hubs, circular recovery, and most admin pages (users, network, audit) still show sample data. They have no backend endpoints yet. The Forecast page says so on screen.
- `POST /api/predictions` (Gemini, with a rule-based fallback) works but isn't used by the frontend yet. Forecasting needs weeks of real donation history first.
- There are no database migrations yet. Changing a model means recreating the tables.
- Delivery is confirmed by the volunteer or NGO. There is no one-time-code check yet.
