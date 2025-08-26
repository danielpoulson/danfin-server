# DanFin TypeScript API

A TypeScript/Express.js conversion of the DanFin budget tracking application.

## Architecture

This project uses a **layered architecture** pattern with the following structure:

```
src/
├── controllers/     # Express route handlers
├── services/        # Business logic layer
├── repositories/    # Database access layer (raw SQL with PostgreSQL)
├── models/          # TypeScript interfaces and types
├── routes/          # Express route definitions
├── middleware/      # Express middleware (CORS, error handling)
├── utils/           # Helper utilities (database, logging)
└── server.ts        # Express server setup and configuration
```

## Features

- **Expense Management**: Track expenses, bills, and budgets
- **Category Management**: Organize expenses by categories
- **Financial Tracking**: Monthly tracking and budget analysis
- **RESTful API**: Clean REST endpoints for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with raw SQL queries
- **Logging**: Winston
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## API Endpoints

### Expenses
- `GET /api/expense/forecast` - Get expense forecast
- `GET /api/expense/:id` - Get expense by ID
- `PUT /api/expense/:id` - Update expense
- `POST /api/expense` - Create new expense
- `DELETE /api/expense/:id` - Delete expense
- `GET /api/budget` - Get budget by categories

### Bills
- `GET /api/expenses/:mode` - Get bills by mode (weekly/monthly/yearly)
- `GET /bills/:mode` - Alternative endpoint for bills

### Tracking
- `POST /api/tracking` - Create tracking record
- `GET /api/tracking/:month` - Get tracking data by month

### Categories
- `GET /api/categories` - Get all categories

## Configuration

The server runs on port 5333 by default and includes CORS configuration for `http://localhost:5173` (frontend).

## Database

Uses raw SQL queries with PostgreSQL. No ORM or migration system - database schema should match the original Go application structure.

## Logging

Winston logger configured with:
- Console output in development
- File logging (error.log, combined.log)
- JSON format for structured logging