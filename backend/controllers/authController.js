const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.SESSION_SECRET || 'scholarhub-polinela-default-secret-key-2026';
const JWT_EXPIRES_IN = '24h';

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

      const adminData = {
        id: admin.id,
        username: admin.username,
        nama_lengkap: admin.nama_lengkap,
      };

      // Generate JWT token
      const token = jwt.sign(adminData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      logger.info(`Admin logged in successfully: ${username}`);
      return successResponse(res, 'Login successful', { ...adminData, token });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(res, 'An error occurred during login', [error.message], 500);
    }
  },

  logout: async (req, res) => {
    // With JWT, logout is handled client-side by removing the token
    logger.info('Admin logged out (token-based)');
    return successResponse(res, 'Logout successful');
  },

  checkSession: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'No active session', [], 401);
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      return successResponse(res, 'Active session found', {
        id: decoded.id,
        username: decoded.username,
        nama_lengkap: decoded.nama_lengkap,
      });
    } catch (error) {
      return errorResponse(res, 'No active session', [], 401);
    }
  },
};

module.exports = authController;
