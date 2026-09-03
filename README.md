# TripFlow

A free full-stack travel planning platform for building and organizing day-by-day itineraries.

> "Plan your entire trip in one calm, visual workspace."

## Features

- Email/password auth (bcrypt + JWT in an httpOnly cookie), sessions persist across refresh
- Trip CRUD, with `endDate >= startDate` enforced on frontend, backend, and schema
- Destination CRUD nested under trips, with ownership enforced via the parent trip
- Day-by-day itinerary, `useReducer`-driven, with drag-and-drop reordering and
  moving stops between days
- Map view (Leaflet/OpenStreetMap - no paid API key required)
- Optimistic UI updates that roll back / resync from the server on failure
- Responsive layout, empty states, inline validation, confirm-before-delete
- Backend integration tests (Jest + Supertest + an in-memory MongoDB)
- Dev seed script with a demo account and sample trip

## Tech stack

**Frontend:** React (Vite), React Router, `useReducer` for itinerary state, Leaflet/react-leaflet for maps, plain CSS with a small design-token system.

**Backend:** Node.js, Express, MongoDB via Mongoose, bcrypt, JWT.

## Architecture

```
Frontend (React)  →  REST API (Express)  →  Mongoose  →  MongoDB
     :5173                :5000
```

```
backend/src/
  routes/        endpoint definitions only
  controllers/    request/response handling, calls services/models
  models/         Mongoose schemas + validation
  middleware/     auth (JWT cookie check) + centralized error handler
  services/       shared business logic (e.g. trip-ownership lookup)
  utils/          token signing, dev seed script

frontend/src/
  pages/          route-level components (Landing, Dashboard, TripWorkspace, tabs...)
  components/     reusable UI (cards, modals, navbar)
  reducers/       itineraryReducer.js - single source of truth for trip workspace state
  services/api.js API layer - every fetch call lives here, nowhere else
  hooks/          useAuth (session context)
```

## Running locally

Requires Node 18+ and a MongoDB instance (local `mongod`, Docker, or a free
MongoDB Atlas cluster).

**Backend**
```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev                # http://localhost:5000
npm run seed                # optional: creates demo@tripflow.dev / password123
npm test                    # runs the integration test suite
```

**Frontend** (separate terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

Visit `http://localhost:5173`, sign up (or log in with the seeded demo
account), and create a trip.

## API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create account, sets auth cookie |
| POST | `/api/auth/login` | Log in, sets auth cookie |
| POST | `/api/auth/logout` | Clears auth cookie |
| GET | `/api/auth/me` | Current user (drives session persistence) |
| POST | `/api/trips` | Create trip |
| GET | `/api/trips` | List the current user's trips |
| GET | `/api/trips/:tripId` | Trip + its destinations |
| PUT | `/api/trips/:tripId` | Update trip |
| DELETE | `/api/trips/:tripId` | Delete trip (and its destinations) |
| POST | `/api/trips/:tripId/destinations` | Add a destination |
| PUT | `/api/destinations/:destinationId` | Update a destination |
| DELETE | `/api/destinations/:destinationId` | Delete a destination |
| PATCH | `/api/trips/:tripId/destinations/reorder` | Persist new day/order for a batch of destinations |

Every route except signup/login is behind `requireAuth`; every trip/destination
mutation re-verifies the requesting user owns the parent trip - a trip ID
can't be guessed to reach another user's data.

## Engineering highlights

- **Single source of truth for itinerary order.** The reducer computes the
  new day/order locally for an instant UI update; the *entire* resulting
  order for the affected batch is then sent to
  `PATCH /destinations/reorder`, so the database never ends up holding a
  different ordering than what the last successful UI action produced.
- **Backend never trusts frontend validation.** The `endDate >= startDate`
  rule is checked in the trip controller (works for both create and
  `findByIdAndUpdate`-style partial updates) *and* as a Mongoose schema
  validator (covers direct `.save()` calls) - not just in the React form.
- **Ownership derived from auth, never from the client.** `req.userId`
  comes from the verified JWT; trip/destination writes always re-check
  `trip.userId === req.userId` server-side.
- **Optimistic updates with resync on failure**, not silent inconsistency:
  drag-and-drop, delete, and move-to-day all update the reducer state
  immediately, then persist; a failed request re-fetches the trip from
  the server rather than leaving the UI showing something the database
  doesn't have.

## Environment variables

See `backend/.env.example` and `frontend/.env.example`. Neither `.env` file
is committed (both are gitignored).

## Known gaps / not yet built

- Destination *search* against a real places/geocoding API (Section 22) -
  the schema and UI support manually entering coordinates, but no external
  search provider is wired in (keeping the app free and dependency-light,
  per the "no paid APIs" requirement).
- Frontend reducer unit tests (backend integration tests are included;
  the reducer is a pure function and straightforward to test the same way
  if you want to add Vitest specs for it).
- Deployment config (Docker/CI) - this is a local-dev-ready scaffold.
