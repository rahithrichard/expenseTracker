# Frontend Routes

Routes are defined with React Router.

File: [frontend/src/routes/AppRoutes.tsx](../frontend/src/routes/AppRoutes.tsx)

## Public routes

- `/`: login page.
- `/signup`: signup page.

## Protected route

- `/home`: dashboard page.

`ProtectedRoute` checks the authentication context. An unauthenticated user is redirected to the login route. The route uses the browser router and the shared page navigation flow.

## Authentication state

File: [frontend/src/auth/AuthContext.tsx](../frontend/src/auth/AuthContext.tsx)

The authentication context owns:

- Current user.
- Authentication status.
- Loading status.
- Login operation.
- Signup operation.
- Logout operation.

It retrieves the current session when the application starts. The context is used by login, signup, protected routes, and navigation components.

## Route flow

```text
/ -> login
login success -> /home
/home -> protected route checks AuthContext
logout -> clears auth cookie and user state
```
