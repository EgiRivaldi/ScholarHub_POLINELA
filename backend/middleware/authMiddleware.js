const { errorResponse } = require('../utils/responseHelper');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  return errorResponse(res, 'Unauthorized access. Please login first.', [], 401);
};

module.exports = {
  isAuthenticated,
};
