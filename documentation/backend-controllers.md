# Backend Controllers

Controllers translate HTTP requests into service calls and return HTTP responses.

## Expense Controller

File: [backend/src/controllers/expenseController.js](../backend/src/controllers/expenseController.js)

### `getExpenses`

- Reads the month with `getMonthStart`.
- Requires `YYYY-MM` format.
- Calls `expenseService.listExpenses`.
- Uses `req.user.id` to scope results.

### `getTotalExpenses`

Calculates:

```text
Total = all expenses for the month
Budget = user budget for the month
Remaining = Budget - Total
```

It returns the response keys `Total`, `Budget`, and `Remaining`.

### `getBudget`

Returns the budget for the current authenticated user and selected month.

### `saveBudget`

Validates the request amount and month, then passes the value to `budgetService.saveBudget`.

### `getCategoryTotals`

Reads an optional category query parameter and returns category totals for the selected month.

### `createExpense`

Builds an expense object with the authenticated user ID and sends it to the expense service.

### `updateExpense`

Passes the request body and authenticated user ID to the update service. A missing expense returns HTTP 404.

### `removeExpense`

Deletes an expense using both the route parameter and authenticated user ID. A missing expense returns HTTP 404.

## Category Controller

File: [backend/src/controllers/categoryController.js](../backend/src/controllers/categoryController.js)

Calls `categoryService.listCategories` and returns the available category names.

## Login Controller

File: [backend/src/controllers/loginController.js](../backend/src/controllers/loginController.js)

### Login

- Calls the login service by email.
- Returns `404` if the user does not exist.
- Compares the submitted password with the stored password hash.
- Creates a JWT when credentials are valid.
- Stores the token in an `HttpOnly` cookie.

### Session

Returns the authenticated user object extracted by the JWT middleware.

### Logout

Clears the authentication cookie and returns HTTP 204.

## Signup Controller

File: [backend/src/controllers/signUpController.js](../backend/src/controllers/signUpController.js)

Validates name, mobile, email, and password. Passwords must contain at least six characters. The controller hashes the password, calls the signup service, and creates a session cookie after successful registration.

## Controller responsibilities

Controllers should:

- Validate basic request shape.
- Extract authenticated user information.
- Call services.
- Handle HTTP status codes.
- Return JSON responses.

They should avoid embedding SQL or implementing persistence details directly.
