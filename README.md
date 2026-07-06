# Classroom Management System

> **Node**: `>=18` · **Go**: `>=1.22` · **PostgreSQL**: `16+`

## Getting Started

```bash
# Clone and install
git clone https://github.com/RahulKeyath/class-room-management-system.git
cd class-room-management-system
npm install

# Start all services (Postgres, Go API, Next.js)
make up

# Or run individually:
make db          # start PostgreSQL only
make api         # run Go API locally
make frontend    # run Next.js dev server
```

## Project Structure

```
├── package.json              # npm workspace root
├── docker-compose.yml        # Local dev containers
├── Makefile                  # Helper commands
├── backend/                  # Go API (Chi + pgx + sqlc)
│   ├── cmd/api/main.go       # Entry point
│   ├── internal/             # Domain modules
│   └── sql/                  # Schema & queries
└── frontend/                 # Next.js 14 (App Router)
    ├── src/app/              # Routes
    ├── src/components/ui/    # Shadcn UI components
    ├── src/features/         # Domain-driven features
    └── src/lib/              # Utilities & API client
```

## Useful Commands

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `make up`         | Start all services via Docker Compose |
| `make down`       | Stop all services                     |
| `make api`        | Run Go API locally                    |
| `make frontend`   | Run Next.js dev server                |
| `make generate`   | Run sqlc code generation              |
| `make migrate`    | Apply SQL migrations                  |
| `make test`       | Run Go tests                          |

## Environment Variables

| Variable            | Default                                                     | Description           |
| ------------------- | ----------------------------------------------------------- | --------------------- |
| `DATABASE_URL`      | `postgres://crm_user:crm_password@localhost:5432/classroom_db` | PostgreSQL connection |
| `PORT`              | `8080`                                                      | API server port       |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080`                                   | Backend URL for frontend |
