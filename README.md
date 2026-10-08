# Scheduler 2

Scheduler 2 is a lightweight scheduling app for groups that need to coordinate availability without the overhead of a full calendar platform.

## Run the backend locally

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs with an in-memory H2 database by default, as configured in `backend/src/main/resources/application.yaml`.

## Run the frontend locally

```bash
cd frontend
npm install
npm run dev
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

```bash
./build.sh
```

## Notes

- The backend serves static frontend assets from `src/main/resources/static` when built for production.
- For development, the frontend and backend can be run separately
