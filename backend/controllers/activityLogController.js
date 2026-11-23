const activityLogModel = require('../models/activityLogModel');
const { paginatedResponse } = require('../utils/responseHelper');

const activityLogController = {
  getAll: async (req, res, next) => {
    try {
      const { pengguna_id, aksi, jenis_entitas, page = 1, limit = 20 } = req.query;

      const filters = {
        pengguna_id: pengguna_id ? parseInt(pengguna_id, 10) : undefined,
        aksi,
        jenis_entitas,
        page: Math.max(1, parseInt(page, 10) || 1),
        limit: Math.max(1, parseInt(limit, 10) || 20),
      };

      const total = await activityLogModel.count(filters);
      const logs = await activityLogModel.findAll(filters);
      const totalPages = Math.ceil(total / filters.limit);

      const pagination = {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      };

      return paginatedResponse(res, 'Log aktivitas berhasil dimuat', logs, pagination);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = activityLogController;
