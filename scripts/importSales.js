import mongoose from "mongoose";
import fs from "fs";
import csv from "csv-parser";
import dotenv from "dotenv";
import Sale from "../src/models/sale.model.js";

dotenv.config();

const filePath = "./data/sales.csv";
const BATCH_SIZE = 1000; // Number of rows inserted per batch

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Normalize CSV columns → camelCase MongoDB fields
const normalizeRow = (row) => ({
  transactionId: Number(row["Transaction ID"]),
  date: new Date(row["Date"]),

  customerId: row["Customer ID"],
  customerName: row["Customer Name"],
  phoneNumber: Number(row["Phone Number"]),
  gender: row["Gender"],
  age: Number(row["Age"]),
  customerRegion: row["Customer Region"],
  customerType: row["Customer Type"],

  productId: row["Product ID"],
  productName: row["Product Name"],
  brand: row["Brand"],
  productCategory: row["Product Category"],
  tags: row["Tags"],

  quantity: Number(row["Quantity"]),
  pricePerUnit: Number(row["Price per Unit"]),
  discountPercentage: Number(row["Discount Percentage"]),
  totalAmount: Number(row["Total Amount"]),
  finalAmount: Number(row["Final Amount"]),

  paymentMethod: row["Payment Method"],
  orderStatus: row["Order Status"],
  deliveryType: row["Delivery Type"],

  storeId: row["Store ID"],
  storeLocation: row["Store Location"],
  salespersonId: row["Salesperson ID"],
  employeeName: row["Employee Name"],
});

// Prepare batching
let batch = [];
let totalInserted = 0;

// MAIN IMPORT SCRIPT
const importCSV = async () => {
  try {
    console.log("🧹 Clearing old records...");
    await Sale.deleteMany({}); // Clean collection before inserting new data

    console.log("📥 Starting CSV import...");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (rawRow) => {
        batch.push(normalizeRow(rawRow));

        // If batch size is reached → insert
        if (batch.length >= BATCH_SIZE) {
          await Sale.insertMany(batch);
          totalInserted += batch.length;
          console.log(`⬆️ Inserted ${totalInserted} records...`);
          batch = []; // Reset batch
        }
      })
      .on("end", async () => {
        // Insert the last batch
        if (batch.length > 0) {
          await Sale.insertMany(batch);
          totalInserted += batch.length;
        }

        console.log(`🎉 Import Completed! Total Inserted: ${totalInserted}`);
        process.exit(0);
      })
      .on("error", (err) => {
        console.error("❌ Error reading CSV:", err);
        process.exit(1);
      });

  } catch (err) {
    console.error("❌ Import Error:", err);
    process.exit(1);
  }
};

// Run importer
importCSV();