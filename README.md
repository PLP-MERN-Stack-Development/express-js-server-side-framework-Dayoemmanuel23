# Express Products API

A RESTful API for managing products with support for CRUD operations, search, filtering, and statistical analysis. Built with Express.js.

# Express Products API

A small, production-ready Express.js API for managing products. This project demonstrates CRUD operations, search, pagination, and aggregation using MongoDB (Mongoose). It includes developer-friendly scripts for local development, seeding, and testing.

---

## Quick links

- Repository: (local workspace)
- Server entry: `server.js`
- Routes: `routes/products.js`
- Model: `models/Product.js`
- DB config: `config/db.js`
- Seed script: `initDB.js`
- Test DB script: `testDB.js`
- Tests: `tests/`

---

## Table of Contents

1. [Requirements](#requirements)
2. [Setup & Installation](#setup--installation)
3. [Environment variables](#environment-variables)
4. [Available scripts](#available-scripts)
5. [Database (MongoDB) notes](#database-mongodb-notes)
6. [API Endpoints](#api-endpoints)
7. [Testing](#testing)
8. [Development & Debugging tips](#development--debugging-tips)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)
11. [License](#license)

---

## Requirements

- Node.js (v14+ recommended)
- npm
- MongoDB (local or remote). MongoDB Compass is optional for visual inspection.

---

## Setup & Installation

1. Clone the repo (or work in your local workspace):

```bash
git clone <repo-url>
cd express-task1
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables and update if needed:

```bash
cp .env.example .env
# Edit .env and set MONGO_URI (or leave default for local MongoDB)
```

4. Seed the database with sample data (optional but useful for development):

```bash
npm run init-db
```

5. Start the server (development):

```bash
npm run dev
```

Server will run at http://localhost:3000 by default (PORT in `.env`).

---

## Environment variables

Copy `.env.example` to `.env` and adjust values.

- `MONGO_URI` - MongoDB connection string. Example for local MongoDB:

```
MONGO_URI=mongodb://localhost:27017/express-products
```

- `NODE_ENV` - `development` or `production`.
- `PORT` - server port (default 3000).
- `API_KEY` - simple API key used by `middleware/auth.js` (optional).

Security note: do not commit `.env` to version control. Use `.env.example` to document expected variables.

---

## Available scripts

Listed in `package.json`:

- `npm start` — start the server (production style)
- `npm run dev` — start server with `nodemon` for development
- `npm run init-db` — seed the database with sample products
- `npm run test-db` — quick script to test DB connectivity
- `npm test` — run Jest tests (if configured)

---

## Database (MongoDB) notes

- The project uses Mongoose (in `models/Product.js`) with a simple product schema.
- Indexes: text index on `name`, index on `category` and `price` were added to help queries.
- Seeding: `initDB.js` clears the `products` collection and inserts five sample documents.
- To inspect data visually, use MongoDB Compass and connect to:

```
mongodb://localhost:27017
```

Then open the `express-products` database and the `products` collection.

---

## API Endpoints

Base path: `/api/products`

All responses are JSON and errors use the global error handler which returns a structure like:

```json
{
    "success": false,
    "error": {
        "name": "NotFoundError",
        "message": "Product not found"
    }
}
```

### GET /api/products

Query parameters:
- `category` (optional) — filter by category (case-insensitive)
- `page` (optional) — page number (default 1)
- `limit` (optional) — items per page (default 10)

Example response:

```json
{
    "total": 5,
    "page": 1,
    "limit": 10,
    "data": [ /* array of product objects */ ]
}
```

### GET /api/products/stats

Returns aggregation data:
- `totalProducts` — total number of products
- `stats` — counts by category
- `averagePrice` — overall average price
- `inStockCount` / `outOfStockCount`
- `averagePriceByCategory` — per-category averages

Example response:

```json
{
    "totalProducts": 5,
    "stats": { "Electronics": 2, "Audio": 1, "Fashion": 1, "Accessories": 1 },
    "averagePrice": 506,
    "inStockCount": 4,
    "outOfStockCount": 1,
    "averagePriceByCategory": { "Electronics": 1050, "Audio": 200 }
}
```

### GET /api/products/search?name=term

Text search across product `name`.

### GET /api/products/:id

Fetch a single product by MongoDB `_id`.

### POST /api/products

Create a new product. JSON body must include `name`, `description`, `price`, `category`. Optional `inStock`.

### PUT /api/products/:id

Update product fields (partial updates allowed).

### DELETE /api/products/:id

Remove a product.

---

## Testing

Quick DB test:

```bash
npm run test-db
```

Unit/Integration tests (Jest + Supertest):

1. Make sure `jest` and `supertest` are installed (they may be listed in `devDependencies`).
2. Run:

```bash
npm test
```

Notes:
- Tests previously included a `products.stats` test. If running tests against the real DB, consider using a separate test database and proper setup/teardown hooks.

---

## Development & Debugging tips

- Use `nodemon` (`npm run dev`) to auto-restart the server on changes.
- To see DB queries and errors, watch the server output — `config/db.js` logs connection success/failure.
- For local DB debugging use MongoDB Compass. If Compass shows no data, verify `MONGO_URI` and that the service is running (check `netstat` or `Get-Service mongodb`).

---

## Troubleshooting

- "Cannot connect to MongoDB": verify `MONGO_URI`, ensure MongoDB is running, check firewall.
- "Permission denied" in Compass: ensure you're not using authentication when MongoDB isn't configured for it, or provide credentials.
- Tests failing due to network/DB: use an in-memory MongoDB server (e.g., `mongodb-memory-server`) for CI and unit tests.

If you want, I can add a `docker-compose.yml` to run MongoDB and the app together.

---

## Contributing

1. Fork
2. Create a branch
3. Implement a small, focused change and test locally
4. Open a PR with a clear description

---

## License

ISC

---

If you'd like, I can also:

- Add a `health` endpoint (`GET /health`) that returns DB connection status and uptime.
- Add CI test workflow for running Jest in GitHub Actions.
- Add `docker-compose.yml` for local development.

Tell me which of these you'd like next and I will implement it.
