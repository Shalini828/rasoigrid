#!/bin/sh
set -e

# Bring the database schema up to date before serving requests.
alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
