# Expense Tracker Documentation

This folder documents the current application architecture and code flow.

## Documentation map

- [Database structure](database-structure.md) — PostgreSQL tables, migrations, relationships, and constraints.
- [Backend services](backend-services.md) — business logic for expenses, budgets, categories, login, and signup.
- [Backend controllers](backend-controllers.md) — HTTP request handling and response construction.
- [Backend routes](backend-routes.md) — Express route definitions and authentication boundaries.
- [Backend middleware](backend-middleware.md) — JWT, password hashing, validation, and error handling.
- [Frontend services](frontend-services.md) — API clients and frontend-to-backend communication.
- [Frontend pages](frontend-pages.md) — application screens and state management.
- [Frontend routes](frontend-routes.md) — React Router navigation and protected routes.
- [Frontend components](frontend-components.md) — reusable UI components and dashboard views.
- [Frontend types](frontend-types.md) — shared TypeScript data contracts.

## Request flow

```text
React page
  -> frontend API service
  -> shared API client
  -> Express route
  -> controller
  -> service
  -> PostgreSQL query
  -> response returned through the same path
```

## Authentication flow

```text
POST /api/user-login
  -> login controller
  -> password comparison
  -> JWT token creation
  -> HttpOnly authToken cookie

GET /api/auth-session
  -> verifyJWT middleware
  -> authenticated user returned to frontend
```

## Important conventions

- Backend files use CommonJS.
- Frontend files use TypeScript and React.
- API routes are mounted under `/api` in the Express application.
- User-specific data is filtered by `req.user.id`.
- Database access is centralized in the backend database configuration module.
