# Database Structure

## Purpose

PostgreSQL stores users, expenses, categories, and monthly budgets for the expense tracker. The database is created and updated with migration scripts.

## Migrations

### 001_create_expenses_table.js

Creates the `expenses` table:

- `id`: string identifier used by the frontend.
- `title`: expense description.
- `amount`: monetary value.
- `category`: category name stored as text.
- `date`: expense date.
- `created_at`: creation timestamp.
- `updated_at`: update timestamp.

The table primary key is `id`.

### 002_create_categories_table.js

Creates the `categories` table:

- `id`: integer primary key.
- `name`: unique category name.

The category table supports the frontend category dropdown and category summaries.

### 003_create_budgets_table.js

Creates the `budgets` table:

- `id`: integer primary key.
- `month_start`: first day of the budget month.
- `amount`: budget amount.
- `created_at`: creation timestamp.
- `updated_at`: update timestamp.

The initial version requires a unique month start, but later migrations make the uniqueness user-specific.

### 003_create_users_table.js

Creates the `users` table:

- `id`: integer identifier.
- `name`: user display name.
- `mobile`: phone number.
- `email`: unique, required email address.
- `password_hash`: hashed password instead of storing plaintext.
- `created_at`: account creation time.

The user ID has a default generated value.

### 005_link_expenses_to_users.js

Adds `user_id` to expenses and creates a foreign key to users. This makes expenses belong to a specific user and supports deleting user records with all related expenses.

Existing expenses are assigned to the only available user during the migration.

### 006_unique_budget_month.js

Creates a unique index on `budgets.month_start`. This prevents more than one budget row for the same month in the original schema.

### 007_scope_budgets_to_users.js

Converts the budget relationship from global to user-specific:

- Adds `user_id` to budgets.
- Preserves existing budget data for a single existing user.
- Removes the global month uniqueness constraint.
- Adds a composite uniqueness constraint on `(user_id, month_start)`.
- Adds a foreign key from budget user IDs to the users table.

## Current relationships

```text
users 1 ──── < expenses
users 1 ──── < budgets
users 1 ──── < categories through shared category names
```

The category table is not directly linked to users. It is a shared list of available expense categories.

## Data rules

- Expense amounts cannot be negative.
- Budget amounts cannot be negative.
- A budget cannot be lower than previously recorded expenses for its month.
- A user can have only one budget row per month.
- Expenses and budgets are deleted when their user is deleted.
- The frontend sends dates in `YYYY-MM-DD` format and months in `YYYY-MM` format.

## Database access

The [backend database configuration](../backend/src/config/db.js) creates PostgreSQL clients, checks connectivity, runs queries, and provides transaction support. The application normally uses `expense_tracker` as the database and `postgres` as the administrative database.
