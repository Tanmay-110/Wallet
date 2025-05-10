/**
 * Standardized API response format
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Human-readable message about the result
 * @param {object|array|null} data - The data payload (if any)
 * @param {array|null} errors - Error details (if any)
 * @returns {object} Formatted response object
 */
const formatResponse = (success, message, data = null, errors = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (errors !== null) {
    response.errors = errors;
  }

  return response;
};

/**
 * Success response helper
 * @param {string} message - Success message
 * @param {object|array|null} data - The data payload
 * @returns {object} Formatted success response
 */
const successResponse = (message, data = null) => {
  return formatResponse(true, message, data);
};

/**
 * Error response helper
 * @param {string} message - Error message
 * @param {array|null} errors - Detailed errors
 * @returns {object} Formatted error response
 */
const errorResponse = (message, errors = null) => {
  return formatResponse(false, message, null, errors);
};

module.exports = {
  successResponse,
  errorResponse
}; 