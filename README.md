# Retail Sales Management System – Backend

A production-ready backend for retail sales analytics built with **Node.js**, **Express**, and **MongoDB**.
Supports **search**, **filters**, **sorting**, **pagination**, and **summary analytics**.
Includes a **CSV → MongoDB importer** with automatic normalization and batch insertion.

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
