# Placement Portal Project

A full-stack placement portal with 3 user roles: students, companies, and admin.

## Tech Stack
- Backend: Node.js, Express
- Database: PostgreSQL (hosted on Render)
- Frontend: Next.js, MUI (in progress)

## Status
🚧 In development

## Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   - DATABASE_URL / connection details
   - JWT_SECRET
4. `npm run dev`

## API Routes (so far)
- `/api/auth` — signup, login
- `/api/jobs` — CRUD
- `/api/students` — CRUD
- `/api/companies` — CRUD
