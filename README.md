# Scheduler 2

Scheduler 2 is a full-stack room scheduling application built with a Spring Boot backend and a Vite + Preact frontend. It supports creating rooms and updating per-user schedule data for a room.

## Tech stack

- Backend: Java 25, Spring Boot 4, Spring Data JPA, PostgreSQL/H2
- Frontend: Vite, Preact, TypeScript
- Containerization: Docker and Docker Compose

## Project structure

```text
scheduler2/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Java sources
│   ├── src/main/resources/   # application configuration and static assets
│   ├── pom.xml               # Maven config
│   └── mvnw / mvnw.cmd       # Maven wrapper
├── frontend/                 # Vite + Preact application
│   ├── src/                  # UI source code
│   ├── package.json          # npm scripts and dependencies
│   └── vite.config.ts
├── Dockerfile                # Multi-stage container build for app
├── scheduler2.yaml           # Docker Compose services for PostgreSQL + backend
├── build.sh                  # Convenience image build script
└── README.md
```

## Prerequisites

- Java 25 or newer
- Maven (or use the included Maven wrapper)
- Node.js 22+
- npm
- Docker and Docker Compose (optional, for containerized setup)

## Run the backend locally

From the project root:

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell or CMD:

```powershell
cd backend
mvnw.cmd spring-boot:run
```

The backend runs with an in-memory H2 database by default, as configured in `backend/src/main/resources/application.yaml`.

## Run the frontend locally

From the project root:

```bash
cd frontend
npm install
npm run dev
```

This starts the Vite dev server, usually on:

```text
http://localhost:5173
```

## Docker Compose setup

The repository includes a Compose file for PostgreSQL and the backend service:

```bash
docker compose -f scheduler2.yaml up --build
```

This starts:

- PostgreSQL on the internal Docker network
- The backend on `http://localhost:9267`

The backend container exposes port `8080` internally and maps it to `9267` on the host.

## Build the production artifact

### With Docker

```bash
docker build -t scheduler2:latest .
```

### With the provided script

```bash
./build.sh
```

## API and app behavior

The backend exposes room-related endpoints under `/api/room`, including:

- `GET /api/room/{roomId}`
- `POST /api/room`
- `PUT /api/room/{roomId}/user/{username}`

The app includes a scheduled cleanup job configured in the backend, which runs on a cron schedule defined in `CleanupJob`.

## Notes

- The backend serves static frontend assets from `src/main/resources/static` when built for production.
- For development, the frontend and backend are typically run separately.
- The Docker configuration uses PostgreSQL, while local development defaults to H2 for convenience.

## Useful commands

```bash
# Backend tests
cd backend
./mvnw test

# Frontend production build
cd frontend
npm run build

# Frontend mock backend
cd frontend
npm run mock-backend
```
