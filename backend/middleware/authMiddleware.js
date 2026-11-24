const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');
const { errorResponse } = require('../utils/responseHelper');

const JWT_SECRET = process.env.SESSION_SECRET || 'scholarhub-polinela-default-secret-key-2026';

const isAuthenticated = async (req, res, next) => {
  let userId = null;

  // 1. Check JWT token from Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return errorResponse(res, 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.', [], 401);
    }
  } else if (req.session && req.session.admin) {
    // 2. Fallback: check session
    userId = req.session.admin.id;
  }

  if (!userId) {
    return errorResponse(res, 'Akses tidak diizinkan. Silakan login terlebih dahulu.', [], 401);
  }

  try {
    // Verify user exists and is active in database on every authenticated request
    const user = await adminModel.findById(userId);
    if (!user) {
      return errorResponse(res, 'Akun pengguna tidak ditemukan.', [], 401);
    }

    if (!user.aktif) {
      return errorResponse(res, 'Akun Anda berstatus nonaktif. Silakan hubungi Administrator Utama.', [], 403);
    }

    req.admin = user;
    return next();
  } catch (error) {
    return errorResponse(res, 'Terjadi kesalahan saat verifikasi otorisasi.', [error.message], 500);
  }
};

// Optional auth: attaches req.admin if valid token is provided, without failing if missing
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await adminModel.findById(decoded.id);
      if (user && user.aktif) {
        req.admin = user;
      }
    } catch (e) {
      // Continue without user
    }
  } else if (req.session && req.session.admin) {
    req.admin = req.session.admin;
  }
  next();
};

// Middleware to enforce specific roles (e.g. 'admin_utama')
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return errorResponse(res, 'Akses tidak diizinkan. Silakan login terlebih dahulu.', [], 401);
    }

    const userRole = req.admin.peran || req.admin.role;
    if (!allowedRoles.includes(userRole)) {
      return errorResponse(
        res,
        'Akses ditolak. Tindakan ini hanya dapat dilakukan oleh peran yang berwenang.',
        [],
        403
      );
    }

    next();
  };
};

// Single unified admin role: any authenticated admin has full access to all management modules
const requireAdminUtama = (req, res, next) => {
  if (!req.admin) {
    return errorResponse(res, 'Akses tidak diizinkan. Silakan login terlebih dahulu.', [], 401);
  }
  next();
};

module.exports = {
  isAuthenticated,
  optionalAuth,
  requireRole,
  requireAdminUtama,
};
