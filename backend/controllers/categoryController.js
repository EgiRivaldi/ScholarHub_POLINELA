const categoryModel = require('../models/categoryModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryModel.findAll();
      return successResponse(res, 'Categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await categoryModel.findById(id);
      if (!category) {
        return errorResponse(res, 'Category not found', [], 404);
      }
      return successResponse(res, 'Category retrieved successfully', category);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama_kategori, deskripsi } = req.body;
      const insertId = await categoryModel.create({ nama_kategori, deskripsi });
      const newCategory = await categoryModel.findById(insertId);
      return successResponse(res, 'Category created successfully', newCategory, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_kategori, deskripsi } = req.body;
      
      const exists = await categoryModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Category not found', [], 404);
      }

      await categoryModel.update(id, { nama_kategori, deskripsi });
      const updatedCategory = await categoryModel.findById(id);
      return successResponse(res, 'Category updated successfully', updatedCategory);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await categoryModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Category not found', [], 404);
      }

      await categoryModel.delete(id);
      return successResponse(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
