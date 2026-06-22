const providerModel = require('../models/providerModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const providerController = {
  getAll: async (req, res, next) => {
    try {
      const providers = await providerModel.findAll();
      return successResponse(res, 'Providers retrieved successfully', providers);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const provider = await providerModel.findById(id);
      if (!provider) {
        return errorResponse(res, 'Provider not found', [], 404);
      }
      return successResponse(res, 'Provider retrieved successfully', provider);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama_penyedia, singkatan, website, logo } = req.body;
      const insertId = await providerModel.create({ nama_penyedia, singkatan, website, logo });
      const newProvider = await providerModel.findById(insertId);
      return successResponse(res, 'Provider created successfully', newProvider, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_penyedia, singkatan, website, logo } = req.body;

      const exists = await providerModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Provider not found', [], 404);
      }

      await providerModel.update(id, { nama_penyedia, singkatan, website, logo });
      const updatedProvider = await providerModel.findById(id);
      return successResponse(res, 'Provider updated successfully', updatedProvider);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await providerModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Provider not found', [], 404);
      }

      await providerModel.delete(id);
      return successResponse(res, 'Provider deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerController;
