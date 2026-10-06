# Expense Tracker POC

This project is a full-stack expense tracker proof of concept. It demonstrates a React frontend, Express backend, PostgreSQL database, JWT authentication, user-scoped expense tracking, budgets, summaries, and charts.

## System Architecture

```text
Browser
   ↓
React SPA / Vite
   ↓
Express API
   ↓
JWT authentication middleware
   ↓
PostgreSQL
```

The frontend entry point is `frontend/src/App.tsx`, while the backend entry point is `backend/src/server.js`.

## Frontend

The frontend uses React, TypeScript, Vite, Bootstrap, React Router, and React Loading Skeleton.

### Routes

- `/` — Login
- `/signup` — Signup
- `/home` — Protected dashboard
- Unknown routes — Redirect to login

The routes are defined in `frontend/src/routes/AppRoutes.tsx`.

### Dashboard

The main dashboard is implemented in `frontend/src/pages/Dashboard.tsx`.

It manages:

- Expense creation and editing
- Expense deletion
- Budget creation and updates
- Monthly filtering
- Loading skeletons
- Category totals
- Spending charts
- User-facing errors

The dashboard calls the API through `frontend/src/services/apiService.ts`.

### UI Components

- `frontend/src/components/Navbar.tsx` — navigation, notifications, profile, and logout
- `frontend/src/components/common/Form.tsx` — expense form
- `frontend/src/components/common/BudgetForm.tsx` — monthly budget form
- `frontend/src/components/common/Popup.tsx` — confirmation popup
- `frontend/src/components/expense/ExpenseTable.tsx` — searchable and filterable expense table
- `frontend/src/components/expense/ExpenseList.tsx` — expense summary cards
- `frontend/src/components/expense/SpendByCategory.tsx` — category spending visualization
- `frontend/src/components/expense/SpendingByTime.tsx` — daily or monthly spending visualization

## Backend

The backend uses Node.js and Express. It is organized into routes, controllers, services, middleware, and configuration files.

### API Routes

The expense routes are defined in `backend/src/routes/expenseRoutes.js`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/expenses` | List monthly expenses |
| GET | `/api/totals-expenses` | Calculate total, budget, and remaining amount |
| GET | `/api/budget` | Load monthly budget |
| POST | `/api/save-budget` | Save monthly budget |
| GET | `/api/filtered-categories-total` | Get category totals |
| POST | `/api/create-expense` | Create expense |
| POST | `/api/update-expense` | Update expense |
| DELETE | `/api/delete-expense/:id` | Delete expense |

Authentication routes are defined in `backend/src/routes/loginRoutes.js`.

### Controllers

The expense controller is in `backend/src/controllers/expenseController.js`.

It handles:

- Monthly validation
- Budget retrieval
- Budget saving
- Category totals
- Expense creation
- Expense updates
- Expense deletion

### Business Logic

The expense service is in `backend/src/services/expenseService.js`.

It performs the following important operations:

- Lists expenses for a month
- Calculates monthly totals
- Calculates category totals
- Creates expenses
- Updates expenses
- Deletes expenses
- Validates budget affordability

The service enforces these rules:

- A positive monthly budget must exist before expenses can be added.
- Expenses cannot exceed the remaining monthly budget.
- Update operations must stay within the budget.
- Expense records are scoped to the authenticated user.

## Authentication and Authorization

JWT verification is implemented in `backend/src/middleware/verifyJWT.js`.

The middleware:

1. Reads the `authToken` cookie.
2. Verifies the JWT signature.
3. Checks token expiration.
4. Adds the authenticated user to the request.
5. Rejects requests without a valid token.

Protected expense and budget routes use this middleware.

The frontend authentication context is in `frontend/src/auth/AuthContext.tsx`.

## Database

PostgreSQL is used for persistence.

The initial expense table is defined in `backend/migrations/001_create_expenses_table.js`.

The main fields are:

- `id` — unique expense identifier
- `title` — expense description
- `amount` — monetary value
- `category` — expense category
- `date` — expense date
- `created_at` — creation timestamp
- `updated_at` — last update timestamp

Database connection and transaction handling are implemented in `backend/src/config/db.js`.

Create and update operations use transactions to keep budget validation and database writes consistent.

## User Data Isolation

Each expense and budget operation receives the authenticated user ID.

For example, expense listing uses:

- The authenticated user ID
- The selected month start date
- The monthly date range

This prevents users from viewing or modifying another user's records.

## Frontend-to-Backend Request Flow

A typical expense creation flow is:

1. The user submits the expense form.
2. The dashboard calls `createExpense`.
3. The frontend sends an authenticated API request.
4. Express invokes the protected expense route.
5. The controller identifies the authenticated user.
6. The service validates the budget.
7. PostgreSQL stores the expense.
8. The dashboard refreshes the dashboard data.

The API client is implemented in `frontend/src/services/apiClient.ts`.

## Testing Strategy

The project uses Vitest, Testing Library, and jsdom.

Tests are organized around components, including:

- Expense list
- Expense table
- Budget form
- Expense form
- Confirmation popup
- Category spending
- Time spending
- Navbar
- Banner
- Loading skeletons

The tests render real components and exercise user interactions where possible.

## How to Run

### Frontend

```powershell
cd frontend
npm install
npm run dev
npm test
npm run build
```

### Backend

```powershell
cd backend
npm install
npm run db:start
npm run migrate
npm run dev
```

The backend expects PostgreSQL to be available using the configuration in `backend/src/config/db.js`.

## POC Scope

### Included

- Authentication and signup
- JWT protected routes
- Expense CRUD
- Monthly budgets
- User isolation
- Expense summaries
- Category visualization
- Time-based visualization
- Responsive UI
- Component-based tests

### Potential Improvements

- Backend unit and integration tests
- Server-side request validation
- Database migration rollback support
- Rate limiting
- Role-based access control
- Email verification
- Reporting exports
- Expense table pagination
- Audit logging
- Docker configuration for PostgreSQL
- CI test automation
