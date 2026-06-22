const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const adminController = {
  getAll: async (req, res, next) => {
    try {
      const admins = await adminModel.findAll();
      return successResponse(res, 'Admins retrieved successfully', admins);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const admin = await adminModel.findById(id);
      if (!admin) {
        return errorResponse(res, 'Admin account not found', [], 404);
      }
      return successResponse(res, 'Admin retrieved successfully', admin);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { username, password, nama_lengkap } = req.body;

      // Check if username already exists
      const existing = await adminModel.findByUsername(username);
      if (existing) {
        return errorResponse(res, 'Username is already taken', [], 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertId = await adminModel.create({
        username,
        password: hashedPassword,
        nama_lengkap,
      });

      const newAdmin = await adminModel.findById(insertId);
      return successResponse(res, 'Admin account created successfully', newAdmin, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, password, nama_lengkap } = req.body;

      const existing = await adminModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Admin account not found', [], 404);
      }

      // Check username uniqueness if changed
      if (username !== existing.username) {
        const dupCheck = await adminModel.findByUsername(username);
        if (dupCheck) {
          return errorResponse(res, 'Username is already taken', [], 400);
        }
      }

      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      await adminModel.update(id, {
        username,
        nama_lengkap,
        password: hashedPassword,
      });

      const updated = await adminModel.findById(id);
      return successResponse(res, 'Admin account updated successfully', updated);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (req.session && req.session.admin && parseInt(id, 10) === req.session.admin.id) {
        return errorResponse(res, 'You cannot delete your own admin account', [], 400);
      }

      const exists = await adminModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Admin account not found', [], 404);
      }

      await adminModel.delete(id);
      return successResponse(res, 'Admin account deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
