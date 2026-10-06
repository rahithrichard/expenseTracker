# Frontend Pages

Pages are React components that compose navigation, forms, data, and dashboard sections.

## Dashboard

File: [frontend/src/pages/Dashboard.tsx](../frontend/src/pages/Dashboard.tsx)

The dashboard owns the main application state:

- Expenses.
- Editing expense.
- Loading and error state.
- Category list.
- Monthly totals.
- Category totals.
- Budget state.
- Selected month.
- Delete confirmation state.

It uses `useCallback` and `useEffect` to refresh data when the selected month changes. A `Promise.all` request loads the expense table, category list, category totals, summary totals, and budget together.

The dashboard:

1. Creates or edits expenses through the shared form.
2. Deletes expenses after confirmation.
3. Saves monthly budgets.
4. Renders expense summaries, the table, and charts.
5. Displays loading skeletons and empty states.

## Login page

File: [frontend/src/pages/login.tsx](../frontend/src/pages/login.tsx)

The login page collects email and password, calls the authentication service through `AuthContext`, and redirects to the dashboard after successful login.

## Signup page

File: [frontend/src/pages/Signup.tsx](../frontend/src/pages/Signup.tsx)

The signup page collects name, mobile, email, and password values and submits them through the authentication context.

## Page data ownership

Dashboard data is owned by the page because it coordinates multiple requests and multiple UI sections. Lower-level components receive data through props and update their own local state only when the component owns interactive behavior.
