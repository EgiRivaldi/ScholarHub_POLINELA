const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const authController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return errorResponse(res, 'Username and password are required', [], 400);
      }

      const admin = await adminModel.findByUsername(username);
      if (!admin) {
        logger.warn(`Failed login attempt for username: ${username} (User not found)`);
        return errorResponse(res, 'Invalid username or password', [], 401);
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        logger.warn(`Failed login attempt for username: ${username} (Incorrect password)`);
        return errorResponse(res, 'Invalid username or password', [], 401);
      }

      // Store in session (exclude password)
      req.session.admin = {
        id: admin.id,
        username: admin.username,
        nama_lengkap: admin.nama_lengkap,
      };

      logger.info(`Admin logged in successfully: ${username}`);
      return successResponse(res, 'Login successful', req.session.admin);
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(res, 'An error occurred during login', [error.message], 500);
    }
  },

  logout: async (req, res) => {
    if (!req.session || !req.session.admin) {
      return errorResponse(res, 'No active session found', [], 400);
    }

    const username = req.session.admin.username;
    req.session.destroy((err) => {
      if (err) {
        logger.error(`Logout failed for ${username}: ${err.message}`);
        return errorResponse(res, 'Failed to logout', [err.message], 500);
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      logger.info(`Admin logged out successfully: ${username}`);
      return successResponse(res, 'Logout successful');
    });
  },

  checkSession: async (req, res) => {
    if (req.session && req.session.admin) {
      return successResponse(res, 'Active session found', req.session.admin);
    }
    return errorResponse(res, 'No active session', [], 401);
  },
};

module.exports = authController;
