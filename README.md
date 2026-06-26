# CodeVector Take-Home Task

## Overview

This project implements a backend service for browsing a large product catalog (~200,000 products) with:

* Fast pagination
* Category filtering
* Stable ordering
* PostgreSQL database
* Prisma ORM
* Express.js API

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL (Neon)
* Prisma ORM

---

## Database Schema

Product fields:

* id
* name
* category
* price
* createdAt
* updatedAt

Index used:

(category, updatedAt, id)

This improves filtering and sorting performance.

---

## Data Generation

A seed script generates 200,000 products.

Approach:

* Batch insertion using Prisma createMany()
* Batch size: 1000
* Random categories
* Random prices
* Random createdAt and updatedAt timestamps

This is significantly faster than inserting rows one by one.

---

## API Endpoints

### Get Products

GET /products

Query Parameters:

* category (optional)
* limit (optional)
* cursorId (optional)

Example:

/products?category=Books&limit=20

---

### Get Statistics

GET /stats

Returns total number of products.

Example Response:

{
"totalProducts": 200000
}

---

## Pagination Strategy

Cursor-based pagination is used.

Why not OFFSET pagination?

OFFSET can cause duplicate or skipped records when new products are inserted or updated while a user is browsing.

Cursor pagination uses the last seen record as a reference point and provides more stable results.

Current implementation uses product id as the cursor.

A production-grade implementation could use a composite cursor based on (updatedAt, id) for complete consistency with the sorting order.

---

## Performance Considerations

* Batch inserts with createMany()
* Indexed queries
* Cursor pagination
* Category filtering using indexed columns

---

## Running Locally

Install dependencies:

npm install

Run migrations:

npx prisma migrate dev

Seed data:

node prisma/seed.js

Start server:

node src/server.js

---

## Future Improvements

* Composite cursor using (updatedAt, id)
* API validation
* Automated tests
* Docker support
* Rate limiting
* Monitoring and logging
