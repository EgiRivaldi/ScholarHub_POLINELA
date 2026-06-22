const multer = require('multer');
const { errorResponse } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the complete error stack trace
  logger.error(err.stack || err.message);

  // Check if it's a Multer error
  if (err instanceof multer.MulterError) {
    let message = 'File upload error';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size must be less than 5MB';
    }
    return errorResponse(res, message, [err.message], 400);
  }

  // Check custom validation / file type error passed from Multer fileFilter
  if (err.message && err.message.includes('images are allowed')) {
    return errorResponse(res, err.message, [], 400);
  }

  // Handle Database Errors (MySQL / mysql2)
  if (err.code && (err.code.startsWith('ER_') || err.sqlState)) {
    // Check for specific constraint errors
    if (err.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Duplicate entry error. Unique constraint violated.', [err.message], 400);
    }
    if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED') {
      return errorResponse(res, 'Cannot delete or update row: it is referenced by another table.', [err.message], 400);
    }
    if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
      return errorResponse(res, 'Foreign key constraint fails. Reference does not exist.', [err.message], 400);
    }
    return errorResponse(res, 'A database error occurred', [], 500);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  return errorResponse(res, message, err.errors || [], statusCode);
};

module.exports = errorHandler;
