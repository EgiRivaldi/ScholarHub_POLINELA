const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseHelper');

const JWT_SECRET = process.env.SESSION_SECRET || 'scholarhub-polinela-default-secret-key-2026';

const isAuthenticated = (req, res, next) => {
  // Check JWT token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.admin = decoded;
      return next();
    } catch (error) {
      return errorResponse(res, 'Unauthorized access. Invalid or expired token.', [], 401);
    }
  }

  // Fallback: check session (for local development)
  if (req.session && req.session.admin) {
    return next();
  }

  return errorResponse(res, 'Unauthorized access. Please login first.', [], 401);
};

module.exports = {
  isAuthenticated,
};
