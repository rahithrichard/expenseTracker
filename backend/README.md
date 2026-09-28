# Expense Tracker Backend

Express and PostgreSQL backend for the expense tracker.

## Setup

```powershell
npm install
npm run migrate
```

Create a `.env` file with PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=expense_tracker
DB_ADMIN_DATABASE=postgres
```

## Run

```powershell
node src/server.js
```

The API and built frontend are served at `http://localhost:3000`.
