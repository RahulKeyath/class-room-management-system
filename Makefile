# ──────────────────────────────────────────────────────────────────────
# Classroom Management System — Makefile
# ──────────────────────────────────────────────────────────────────────

.PHONY: up down restart logs db api frontend migrate generate build test clean

# ─── Docker ──────────────────────────────────────────────────────────

## Start all services
up:
	docker compose up -d --build

## Stop all services
down:
	docker compose down

## Restart all services
restart: down up

## Show service logs (follow mode)
logs:
	docker compose logs -f

## Start only the database
db:
	docker compose up -d postgres

# ─── Backend (Go) ───────────────────────────────────────────────────

## Run the Go API locally (requires DATABASE_URL env var)
api:
	cd backend && go run ./cmd/api

## Build the Go binary
build:
	cd backend && go build -o bin/api ./cmd/api

## Run Go tests
test:
	cd backend && go test ./...

# ─── Code Generation ────────────────────────────────────────────────

## Run sqlc to generate Go code from SQL queries
generate:
	cd backend && (which sqlc >/dev/null 2>&1 && sqlc generate || $$(go env GOPATH)/bin/sqlc generate)

# ─── Database Migrations ────────────────────────────────────────────

## Apply schema migrations to the running PostgreSQL container
migrate:
	docker compose exec -T postgres psql -U crm_user -d classroom_db \
		-f /docker-entrypoint-initdb.d/001_attendance.sql

# ─── Frontend ───────────────────────────────────────────────────────

## Run the frontend dev server
frontend:
	cd frontend && npm run dev

## Install dependencies
install:
	npm install

# ─── Cleanup ─────────────────────────────────────────────────────────

## Remove build artefacts and Docker volumes
clean:
	docker compose down -v
	rm -rf backend/bin
	rm -rf frontend/dist
