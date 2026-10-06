# Backend Middleware

Middleware runs before controllers and provides cross-cutting behavior.

## JWT middleware

File: [backend/src/middleware/jwt.js](../backend/src/middleware/jwt.js)

`createToken` signs a user payload using the `JWT_SECRET` environment variable. The token contains the user ID, email, and name.

## JWT verification

File: [backend/src/middleware/verifyJWT.js](../backend/src/middleware/verifyJWT.js)

The middleware:

1. Reads the `authToken` cookie.
2. Verifies the JWT.
3. Finds the user in the database.
4. Adds the sanitized user object to `req.user`.
5. Returns HTTP 401 when the token is missing, invalid, or the user no longer exists.

This middleware is attached to protected routes.

## Password hashing

File: [backend/src/middleware/bcrypt.js](../backend/src/middleware/bcrypt.js)

The module uses bcrypt to hash passwords during signup and compare passwords during login. The password hash is stored in the user table and is never returned to the frontend.

## Error handler

File: [backend/src/middleware/errorHandler.js](../backend/src/middleware/errorHandler.js)

The global error handler converts known status codes and unexpected errors into consistent JSON responses. It is registered in the Express application after all routes.

## Request boundary

```text
Express middleware
  -> JWT verification
  -> controller
  -> service
  -> PostgreSQL
```

This keeps authentication, authorization-sensitive user identity, and error responses outside the business services.
