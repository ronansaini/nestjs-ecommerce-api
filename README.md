# NestJS E-commerce API

A NestJS REST API starter with PostgreSQL and TypeORM. The initial schema covers product categories and products.

## Run locally

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL: `docker compose up -d db`
3. Install dependencies: `npm install`
4. Start the API: `npm run start:dev`

The API is available at `http://localhost:3000/api`.

To run both the API and PostgreSQL in Docker, use `docker compose up --build`.

The database init script runs only when PostgreSQL initializes an empty data volume. For an existing database, apply schema changes as migrations rather than relying on `init.sql`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/categories` | Create a category |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/categories/:id` | Get a category |
| `PATCH` | `/api/categories/:id` | Update a category |
| `DELETE` | `/api/categories/:id` | Delete a category |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products` | List products |
| `GET` | `/api/products/:id` | Get a product |
| `PATCH` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

Product `price` is sent as a decimal string (for example, `"29.99"`) to preserve decimal precision. A product can optionally reference a category using `categoryId`.

Example:

```json
{
  "productName": "Desk Lamp",
  "description": "LED desk lamp",
  "price": "39.95",
  "categoryId": 1
}
```

The database credentials in `.env.example` and `docker-compose.yml` are for local development only. Set strong secrets for deployed environments.
