# Frontend Types

TypeScript types define the shape of data exchanged between frontend components, services, and the backend.

## Expense type

File: [frontend/src/types/expense.ts](../frontend/src/types/expense.ts)

Defines an expense:

- `id`: expense identifier.
- `title`: expense title.
- `amount`: monetary value.
- `category`: category name.
- `date`: expense date.

## Expense table columns

File: [frontend/src/types/expenseColumn.ts](../frontend/src/types/expenseColumn.ts)

Defines the columns used by the expense table and how each column is rendered.

## Table type

File: [frontend/src/types/tableType.ts](../frontend/src/types/tableType.ts)

Defines the shared table type used by the expense table implementation.

## Login credentials

File: [frontend/src/types/logincredentials.ts](../frontend/src/types/logincredentials.ts)

Defines the email and password values accepted by the login API.

## Navigation type

File: [frontend/src/types/nav.ts](../frontend/src/types/nav.ts)

Defines navigation item values used by the application navigation components.

## Frontend-backend data contract

```text
Expense:
{
  id: string,
  title: string,
  amount: number,
  category: string,
  date: string
}

Budget:
{
  monthStart: string,
  amount: number
}

Summary total:
{
  category: string,
  total: number
}
```

The backend returns total values with capitalized property names such as `Total`, `Budget`, and `Remaining`, while the frontend converts them into its own typed state structures.
