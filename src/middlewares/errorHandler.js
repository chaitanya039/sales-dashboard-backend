import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // If it's a custom ApiError, return proper status + message
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, null, err.message));
  }

  // Fallback — any other unexpected error
  return res
    .status(500)
    .json(new ApiResponse(500, null, "Internal server error"));
};

export default errorHandler;