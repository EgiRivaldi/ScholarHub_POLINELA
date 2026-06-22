const dashboardModel = require('../models/dashboardModel');
const { successResponse } = require('../utils/responseHelper');

const dashboardController = {
  getStats: async (req, res, next) => {
    try {
      const stats = await dashboardModel.getStats();
      return successResponse(res, 'Dashboard statistics retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  },

  getRecent: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const recent = await dashboardModel.getRecentScholarships(limit);
      return successResponse(res, 'Recent scholarships retrieved successfully', recent);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = dashboardController;
