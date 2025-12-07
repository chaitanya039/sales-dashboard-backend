import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

import Sale from "../models/sale.model.js";

import { buildSearchQuery } from "../services/search.service.js";
import { buildFilterQuery } from "../services/filter.service.js";
import { buildSortQuery } from "../services/sort.service.js";
import { buildPagination } from "../services/pagination.service.js";

export const getSales = asyncHandler(async (req, res) => {

  // 1️⃣ Build Filter + Search Query
  const filterQuery = buildFilterQuery(req.query);
  const searchQuery = buildSearchQuery(req.query.search);

  const query = { 
    ...filterQuery, 
    ...searchQuery 
  };

  // 2️⃣ Pagination
  const { skip, perPage, currentPage } = buildPagination(
    req.query.page,
    req.query.limit
  );

  // 3️⃣ Sorting
  const sortQuery = buildSortQuery(req.query.sort, req.query.order);

  // 4️⃣ Fetch Paginated Data
  const sales = await Sale.find(query)
    .sort(sortQuery)
    .skip(skip)
    .limit(perPage)
    .lean();

  // Count Total Results
  const totalResults = await Sale.countDocuments(query);

  // 5️⃣ Summary Aggregation (using camelCase DB fields)
  const summaryAgg = await Sale.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalUnits: { $sum: "$quantity" },
        totalAmount: { $sum: "$totalAmount" },
        totalDiscount: { $sum: "$discountPercentage" },
        totalOrders: { $sum: 1 },
        netRevenue: { $sum: "$finalAmount" }
      }
    }
  ]);

  const summary = summaryAgg[0] || {
    totalUnits: 0,
    totalAmount: 0,
    totalDiscount: 0,
    totalOrders: 0,
    netRevenue: 0
  };

  // 6️⃣ Return Final Response
  return res.status(200).json(
    new ApiResponse(200, {
      totalResults,
      currentPage,
      totalPages: Math.ceil(totalResults / perPage),
      summary,
      data: sales
    })
  );
});