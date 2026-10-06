# Backend Routes

Routes connect HTTP paths to controllers and middleware.

The Express application mounts these routers under `/api`.

## Expense routes

File: [backend/src/routes/expenseRoutes.js](../backend/src/routes/expenseRoutes.js)

| Method | Path | Handler | Authentication |
|---|---|---|---|
| GET | `/api/expenses` | `getExpenses` | Required |
| GET | `/api/totals-expenses` | `getTotalExpenses` | Required |
| GET | `/api/budget` | `getBudget` | Required |
| GET | `/api/filtered-categories-total` | `getCategoryTotals` | Required |
| POST | `/api/create-expense` | `createExpense` | Required |
| POST | `/api/update-expense` | `updateExpense` | Required |
| POST | `/api/save-budget` | `saveBudget` | Required |
| DELETE | `/api/delete-expense/:id` | `removeExpense` | Required |

Each route uses `verifyToken`, which checks the session cookie before continuing.

## Category routes

File: [backend/src/routes/categoryRoutes.js](../backend/src/routes/categoryRoutes.js)

| Method | Path | Handler | Authentication |
|---|---|---|---|
| GET | `/api/expense-categories` | `getCategories` | Required |

This endpoint returns the available categories used by the expense form.

## Login and signup routes

File: [backend/src/routes/loginRoutes.js](../backend/src/routes/loginRoutes.js)

| Method | Path | Handler | Authentication |
|---|---|---|---|
| POST | `/api/user-login` | `userLogin` | Not required |
| POST | `/api/user-signup` | `userSignUp` | Not required |
| GET | `/api/auth-session` | `getSession` | Required |
| POST | `/api/user-logout` | `userLogout` | Required |

The login and signup endpoints are intentionally public, while session and logout endpoints require a valid JWT.

## Application mounting

File: [backend/src/app.js](../backend/src/app.js)

The application:

1. Enables CORS.
2. Parses JSON request bodies.
3. Parses cookies.
4. Creates a database health endpoint at `/api/health/database`.
5. Mounts expense, category, and authentication routers.
6. Serves the built frontend for non-API GET requests.
7. Applies the global error handler.

The frontend API base is normally `/api/`, so URLs such as `/api/expenses` map to the route above.
