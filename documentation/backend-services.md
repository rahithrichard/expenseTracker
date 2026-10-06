# Backend Services

Services contain business rules and database operations. They are called by controllers and keep request handling separate from SQL.

## Expense Service

File: [backend/src/services/expenseService.js](../backend/src/services/expenseService.js)

### Responsibilities

- List expenses for a user and month.
- Calculate total expense spending.
- Calculate category totals.
- Create, update, and delete expenses.
- Validate expense amounts.
- Enforce the monthly budget rule.

### Monthly filtering

The service uses PostgreSQL date ranges:

```sql
WHERE user_id = $2
  AND date >= $1::date
  AND date < ($1::date + INTERVAL '1 month')
```

The first parameter is the first day of the month, such as `2026-10-01`.

### Budget validation

`assertExpenseFitsBudget` checks that:

1. A budget exists for the user and month.
2. The budget is positive.
3. The expense amount and existing spending do not exceed the budget.

The check is performed inside a transaction, so the expense is not committed if the budget is exceeded.

### Create and update

- `createExpense` inserts a new row with a generated ID from the request.
- `updateExpense` locates the expense by both ID and user ID.
- `deleteExpense` removes only an expense owned by the authenticated user.
- User ownership in the query prevents one user from modifying another user's expense.

## Budget Service

File: [backend/src/services/budgetService.js](../backend/src/services/budgetService.js)

### Responsibilities

- Retrieve a monthly budget.
- Save or update a monthly budget.
- Prevent a budget from being lower than existing spending.

### Retrieval

If no budget exists, the service returns a zero budget for the selected month.

### Saving

The service:

1. Validates the amount.
2. Calculates existing expenses for the month.
3. Ensures the budget is not below spending.
4. Uses an upsert query to update an existing budget or insert a new one.

The database uses `(user_id, month_start)` as the unique key.

## Category Service

File: [backend/src/services/categoryService.js](../backend/src/services/categoryService.js)

### Responsibilities

- Return the available category names.
- Calculate totals for each category.
- Aggregate expense amounts by category.

The category list is ordered by the category table's ID. `COALESCE` ensures categories without expenses have a total of zero.

## Login Service

File: [backend/src/services/loginService.js](../backend/src/services/loginService.js)

This service retrieves a user by email and returns the password hash, user ID, name, mobile number, and email. The controller performs password verification and token creation.

## Signup Service

File: [backend/src/services/signUpServices.js](../backend/src/services/signUpServices.js)

This service inserts a new user and returns the created user. The controller hashes the password before calling it and creates the authentication token after successful signup.

## Shared database helpers

File: [backend/src/config/db.js](../backend/src/config/db.js)

The module provides:

- `query`: runs a one-shot PostgreSQL query.
- `withTransaction`: starts a transaction, commits on success, and rolls back on failure.
- `checkDatabaseConnection`: verifies that PostgreSQL is reachable.
- `createClient`: creates a client using the configured database credentials.
- `createAdminClient`: creates a client using the administrative database.

These helpers keep service files from directly managing PostgreSQL connections.
