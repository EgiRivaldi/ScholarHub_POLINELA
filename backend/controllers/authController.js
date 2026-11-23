const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const activityLogModel = require('../models/activityLogModel');
const { recordFailedAttempt, clearFailedAttempts } = require('../middleware/rateLimitMiddleware');
const { successResponse, errorResponse } = require('../utils/responseHelper');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.SESSION_SECRET || 'scholarhub-polinela-default-secret-key-2026';
const JWT_EXPIRES_IN = '24h';

const authController = {
  login: async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';

    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return errorResponse(res, 'Username dan kata sandi wajib diisi', [], 400);
      }

      // Find user from database table `pengguna`
      const admin = await adminModel.findByUsername(username);
      if (!admin) {
        recordFailedAttempt(ip);
        logger.warn(`Failed login attempt for username: ${username} (User not found) from IP: ${ip}`);
        return errorResponse(res, 'Nama pengguna atau kata sandi tidak valid', [], 401);
      }

      // Check if user is active
      if (!admin.aktif) {
        logger.warn(`Login rejected: Account is inactive for username: ${username}`);
        return errorResponse(res, 'Akun Anda dinonaktifkan. Silakan hubungi Administrator Utama.', [], 403);
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, admin.hash_kata_sandi || admin.password);
      if (!isMatch) {
        recordFailedAttempt(ip);
        logger.warn(`Failed login attempt for username: ${username} (Incorrect password) from IP: ${ip}`);
        return errorResponse(res, 'Nama pengguna atau kata sandi tidak valid', [], 401);
      }

      // Clear any failed rate-limit attempts on success
      clearFailedAttempts(ip);

      // Clean payload for JWT and client response (NO password hash included!)
      const adminData = {
        id: admin.id,
        nama_pengguna: admin.nama_pengguna,
        username: admin.nama_pengguna,
        nama_lengkap: admin.nama_lengkap,
        peran: admin.peran,
        role: admin.peran,
        aktif: admin.aktif,
      };

      // Generate JWT token
      const token = jwt.sign(adminData, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      // If session is used
      if (req.session) {
        req.session.admin = adminData;
      }

      // Record activity log for successful login
      await activityLogModel.log({
        pengguna_id: admin.id,
        aksi: 'masuk',
        jenis_entitas: 'pengguna',
        id_entitas: admin.id,
        data_sesudah: { nama_pengguna: admin.nama_pengguna, ip },
      });

      logger.info(`Admin logged in successfully: ${username} (Role: ${admin.peran})`);
      return successResponse(res, 'Login berhasil', { ...adminData, token });
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(res, 'Terjadi kesalahan sistem saat proses login', [error.message], 500);
    }
  },

  logout: async (req, res) => {
    try {
      if (req.session) {
        req.session.destroy();
      }
      logger.info(`Admin logged out: ${req.admin?.nama_pengguna || 'unknown'}`);
      return successResponse(res, 'Logout berhasil');
    } catch (error) {
      return errorResponse(res, 'Terjadi kesalahan saat logout', [error.message], 500);
    }
  },

  checkSession: async (req, res) => {
    try {
      // req.admin has already been verified from database by isAuthenticated middleware
      const user = req.admin;
      if (!user) {
        return errorResponse(res, 'Sesi tidak aktif', [], 401);
      }

      return successResponse(res, 'Sesi aktif ditemukan', {
        id: user.id,
        nama_pengguna: user.nama_pengguna,
        username: user.nama_pengguna,
        nama_lengkap: user.nama_lengkap,
        peran: user.peran,
        role: user.peran,
        aktif: user.aktif,
      });
    } catch (error) {
      return errorResponse(res, 'Sesi tidak aktif', [], 401);
    }
  },
};

module.exports = authController;
