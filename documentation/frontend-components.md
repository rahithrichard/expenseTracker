# Frontend Components

Components are separated by responsibility so pages can remain focused on application state.

## Expense summary list

File: [frontend/src/components/expense/ExpenseList.tsx](../frontend/src/components/expense/ExpenseList.tsx)

Renders Total, Budget, and Remaining summary cards with icons and values. It receives a list of category/total objects and maps each object to a list item.

## Expense table

File: [frontend/src/components/expense/ExpenseTable.tsx](../frontend/src/components/expense/ExpenseTable.tsx)

Displays expense rows and supports editing and deleting individual entries through callbacks supplied by the dashboard.

## Expense form

File: [frontend/src/components/common/Form.tsx](../frontend/src/components/common/Form.tsx)

Creates or updates expense records. It manages form values, validation, category selection, amount limits, and the save state.

## Budget form

File: [frontend/src/components/common/BudgetForm.tsx](../frontend/src/components/common/BudgetForm.tsx)

Collects and submits the monthly budget amount. It is used by the dashboard when the user wants to change or create a budget.

## Spending category chart

File: [frontend/src/components/expense/SpendByCategory.tsx](../frontend/src/components/expense/SpendByCategory.tsx)

Calculates percentages and renders a donut chart plus category legend.

## Spending by time

File: [frontend/src/components/expense/SpendingByTime.tsx](../frontend/src/components/expense/SpendingByTime.tsx)

Groups expenses by date or period and renders time-based spending visualizations.

## Navigation and layout

Files:

- [frontend/src/components/Navbar.tsx](../frontend/src/components/Navbar.tsx)
- [frontend/src/components/Banner.tsx](../frontend/src/components/Banner.tsx)

These components provide navigation, branding, and application information.

## Loading states

Skeleton files under [frontend/src/components/expense](../frontend/src/components/expense) display placeholders while dashboard data is loading.
