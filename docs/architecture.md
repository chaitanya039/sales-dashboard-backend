# Backend Architecture Documentation

This document provides a clear overview of the backend architecture, data flow, folder structure, and responsibilities of each module within the Retail Sales Management System – Backend.

---

## 🏗 1. Backend Architecture

The backend follows a modular, service-driven architecture built using:

* Node.js (runtime)
* Express.js (API framework)
* MongoDB (database)
* Mongoose (ODM)
* CSV Parser + Batch Importer (data ingestion)

### ✔ Key Characteristics

* Layered architecture (Controller → Services → DB Layer → Response)
* Clean separation of concerns
* Extensible and scalable
* Optimized for large datasets (batch CSV import)
* RESTful principles
* CamelCase normalized database schema
* Query-based filtering, searching & sorting

### ✔ High-Level Component Overview

```
Client (Frontend)
        ↓
  Express Router
        ↓
  Controller Layer
        ↓
  Service Layer (Search, Filter, Sort, Pagination)
        ↓
  MongoDB (Queries & Aggregations)
        ↓
  Response Builder (ApiResponse)
        ↓
Client
```

---

## 🔄 2. Data Flow

Below is the typical request → response flow for `/sales`:

### **Step 1 — User Requests Data**

Frontend sends an HTTP request:

```
GET /sales?page=1&limit=20&search=neha&category=Beauty&tags=organic
```

### **Step 2 — Controller Receives Request**

`sales.controller.js`:

* Reads query params
* Calls service modules:

  * `buildFilterQuery`
  * `buildSearchQuery`
  * `buildSortQuery`
  * `buildPagination`

### **Step 3 — Services Build MongoDB Query**

#### Filtering

```
region → customerRegion
category → productCategory
tags → regex match
```

#### Search

```
customerName: { $regex: /neha/i }
```

#### Sorting

```
sort by: customerName, date, quantity, finalAmount
```

#### Pagination

```
skip = (page - 1) * limit
limit = 20
```

### **Step 4 — Database Query Execution**

Mongoose performs:

* Filtered + Sorted + Paginated `find()`
* Summary aggregation:

  * totalUnits
  * totalAmount
  * totalDiscount
  * netRevenue
  * totalOrders

### **Step 5 — ApiResponse Wrapper Returns JSON**

```
{
  "totalResults": 5200,
  "currentPage": 1,
  "totalPages": 260,
  "summary": {...},
  "data": [...]
}
```

---

## 📁 3. Folder Structure

```
backend/
 ├── data/
 │    └── sales.csv
 ├── scripts/
 │    └── importSales.js        # CSV → MongoDB batch importer
 ├── src/
 │    ├── controllers/
 │    │    └── sales.controller.js
 │    ├── models/
 │    │    └── sale.model.js    # Mongoose schema
 │    ├── services/
 │    │    ├── search.service.js
 │    │    ├── filter.service.js
 │    │    ├── sort.service.js
 │    │    └── pagination.service.js
 │    ├── utils/
 │    │    ├── ApiResponse.js
 │    │    ├── asyncHandler.js
 │    │    └── ApiError.js
 │    ├── routes/
 │    │    └── sales.routes.js
 │    └── server.js
 ├── .env
 └── package.json
```

---

## 🧩 4. Module Responsibilities

### 📌 Controller Layer (`controllers/`)

`sales.controller.js`

* Handles incoming requests
* Combines filters, search, sorting, pagination
* Executes DB queries
* Performs summary aggregations
* Returns formatted ApiResponse

---

### 📌 Service Layer (`services/`)

#### `search.service.js`

* Adds case-insensitive regex search
* Handles global search logic

#### `filter.service.js`

Handles filters:

* region
* gender
* category
* tags
* paymentMethod
* ageMin / ageMax
* startDate / endDate

#### `sort.service.js`

* Builds MongoDB sort object
* Supports multiple fields

#### `pagination.service.js`

Calculates:

* skip
* limit
* currentPage

---

### 📌 Model Layer (`models/`)

#### `sale.model.js`

* Defines MongoDB schema
* Represents sales record

---

### 📌 Utility Layer (`utils/`)

| File            | Purpose                                  |
| --------------- | ---------------------------------------- |
| ApiResponse.js  | Standard response structure              |
| ApiError.js     | Standard API error class                 |
| asyncHandler.js | Wraps async functions, removes try/catch |

---

### 📌 Script Layer (`scripts/`)

`importSales.js`

* Cleans old DB records
* Reads CSV as stream
* Converts keys → camelCase
* Inserts data in batches

---

## 🏁 Summary

This backend provides:

* Clean, modular architecture
* Extensible service layer
* Memory-safe CSV ingestion
* Filterable, searchable, sortable sales data
* Efficient MongoDB queries & aggregations
* Production-ready structure suitable for deployment