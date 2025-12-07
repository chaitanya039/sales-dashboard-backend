class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors; // array of validation errors or details
    this.success = false;
    this.data = null;

    // Stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
