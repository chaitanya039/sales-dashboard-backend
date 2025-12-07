# Retail Sales Management System – Backend

A production-ready backend for retail sales analytics built with **Node.js**, **Express**, and **MongoDB**.
Supports **search**, **filters**, **sorting**, **pagination**, and **summary analytics**.
Includes a **CSV → MongoDB importer** with automatic normalization and batch insertion.

---

## Backend – Retail Sales Management System

## 1. Overview

This backend processes retail sales CSV data and exposes a single `/sales` API supporting dynamic search, filtering, sorting, and pagination.
Data is normalized, stored in memory, and optimized for fast query operations.
The backend is built using production-grade architecture with services, controllers, middleware, and typed responses.

---

## 2. Tech Stack

* Node.js
* Express.js
* csv-parser (stream-based CSV ingestion)
* TypeScript (optional)
* Custom service-layer architecture
* ApiError / ApiResponse pattern
* asyncHandler wrapper
* CORS enabled

---

## 3. Search Implementation Summary

* Search is applied on raw dataset before filters/sorting.
* Supports case-insensitive partial search on:

  * **Customer Name**
  * **Phone Number**
* Implemented using a dedicated `search.service.js` (pure function).
* Integrated in pipeline: `search → filter → sort → pagination`.

---

## 4. Filter Implementation Summary

Filters operate independently and can be combined.
Supported filters include:

* **Gender**
* **Customer Region**
* **Age range (ageMin–ageMax)**
* **Product Category**
* **Tags (multi-value)**
* **Payment Method**
* **Date range (startDate–endDate)**

Filtering is handled by **filter.service.js**, which transforms the in-memory dataset based on query parameters.

---

## 5. Sorting Implementation Summary

Sorting is applied after search and filters.
Supported fields:

* **date** (newest first)
* **quantity**
* **customerName** (A–Z)

A mapping strategy is used in `sort.service.js` to avoid conditional blocks and make future extensions easy.

---

## 6. Pagination Implementation Summary

Pagination is performed last, after search/filter/sort are complete.

* Default: `page=1`, `limit=10`
* Response returns:

  * `currentPage`
  * `totalPages`
  * `totalResults`
  * Paginated `data[]`

Implemented via `pagination.service.js`.

---

## 7. Setup Instructions

### Install dependencies

```sh
cd backend
npm install
```

### Add environment variables

Create `.env`:

```env
PORT=3000
CSV_PATH=./data/sales.csv
```

### Start server

```sh
npm start
```

---

## 🚀 1. Setup

### Clone repository

```bash
git clone <your-repo-url>
cd backend
```

### Install dependencies

```bash
npm install
```

---

## 🔧 2. Environment Variables

Create a `.env` file inside `/backend`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/sales_db
PORT=5000
```

> (Local MongoDB recommended — Atlas free tier is too small for large datasets.)

---

## 📦 3. Add Dataset

Place your CSV file here:

```
backend/data/sales.csv
```

The importer automatically:

* Normalizes all CSV column names to camelCase
* Cleans data
* Inserts into MongoDB in batches
* Prevents memory overflow

---

## 🔄 4. Import CSV → MongoDB

Run:

```bash
npm run import-data
```

### Expected output:

```
📦 MongoDB Connected
🧹 Clearing old records...
⬆️ Inserted 1000 records...
⬆️ Inserted 2000 records...
🎉 Import Completed! Total Inserted: XXXXX
```

---

## ▶️ 5. Start Backend Server

```bash
npm run start
```

Backend runs at:

```
http://localhost:5000
```

---

## 📡 6. API Endpoint

### GET `/sales`

Supports:

* search
* region
* gender
* category
* tags
* paymentMethod
* ageMin, ageMax
* startDate, endDate
* sort, order
* page, limit

### Example:

```
/sales?page=1&limit=20&region=North&paymentMethod=UPI&tags=organic
```

---

## 📊 7. Summary Metrics Returned by API

Returns:

* totalUnits
* totalAmount
* totalDiscount
* totalOrders
* netRevenue

### Example response:

```json
{
  "totalResults": 5200,
  "currentPage": 1,
  "totalPages": 260,
  "summary": {
    "totalUnits": 250000,
    "totalAmount": 12398450,
    "totalDiscount": 129384,
    "totalOrders": 5200,
    "netRevenue": 12269066
  },
  "data": []
}
```

---

## 📁 8. Folder Structure

```
backend/
 ├── data/
 │    └── sales.csv
 ├── scripts/
 │    └── importSales.js
 ├── src/
 │    ├── controllers/
 │    ├── models/
 │    ├── services/
 │    └── utils/
 ├── .env
 └── server.js
```

---

## 🧠 9. Features

* Search by customer name
* **Filtering by:**

  * Region
  * Gender
  * Product category
  * Tags
  * Payment method
  * Age range
  * Date range
* Sorting (name, date, quantity, amount, etc.)
* Pagination
* Fully normalized MongoDB dataset
* CSV → DB importer with batching (handles large files)

---