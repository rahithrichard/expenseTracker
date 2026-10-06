# Frontend Services

Frontend services provide the interface between React components and the backend API.

## Shared API client

File: [frontend/src/services/apiClient.ts](../frontend/src/services/apiClient.ts)

`apiRequest`:

- Builds the full URL.
- Adds query parameters.
- Sets JSON headers for request bodies.
- Sends credentials so the backend cookie is included.
- Parses successful JSON responses.
- Converts HTTP errors into JavaScript errors containing the backend message.
- Handles HTTP 204 responses.

The API URL defaults to `/api/` and can be overridden with `VITE_API_URL`.

## Expense API service

File: [frontend/src/services/apiService.ts](../frontend/src/services/apiService.ts)

The service exposes functions for:

- Reading expenses.
- Creating expenses.
- Deleting expenses.
- Reading the monthly budget.
- Saving a monthly budget.

It sends responses through `apiRequest` and maps the backend route names to frontend-facing function names.

## Authentication API service

File: [frontend/src/services/loginApiService.ts](../frontend/src/services/loginApiService.ts)

Provides:

- Login.
- Signup.
- Current session lookup.
- Logout.

These functions use the same API client and therefore share cookie handling and error handling.

## Local storage service

File: [frontend/src/services/localstorageSevice.ts](../frontend/src/services/localstorageSevice.ts)

This service can store application data in browser local storage. It is separate from the backend API and should be used only for non-sensitive client-side state.

## Service relationships

```text
Dashboard page
  -> apiService functions
  -> apiRequest
  -> backend route
  -> controller
  -> service
  -> PostgreSQL
```

Pages should call services rather than directly constructing HTTP requests.
