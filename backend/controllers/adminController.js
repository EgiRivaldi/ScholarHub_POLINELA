const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const adminController = {
  getAll: async (req, res, next) => {
    try {
      const admins = await adminModel.findAll();
      return successResponse(res, 'Daftar administrator berhasil dimuat', admins);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const admin = await adminModel.findById(id);
      if (!admin) {
        return errorResponse(res, 'Akun administrator tidak ditemukan', [], 404);
      }
      return successResponse(res, 'Data administrator berhasil dimuat', admin);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { username, nama_pengguna, password, nama_lengkap, peran, role, aktif } = req.body;
      const finalUsername = nama_pengguna || username;

      // Check if username already exists
      const existing = await adminModel.findByUsername(finalUsername);
      if (existing) {
        return errorResponse(res, 'Username sudah digunakan oleh akun lain', [], 400);
      }

      const finalRole = peran || role || 'admin';
      if (!['admin', 'admin_utama'].includes(finalRole)) {
        return errorResponse(res, 'Peran tidak valid. Pilihan: admin atau admin_utama', [], 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertId = await adminModel.create({
        nama_pengguna: finalUsername,
        hash_kata_sandi: hashedPassword,
        nama_lengkap,
        peran: finalRole,
        aktif: aktif !== undefined ? (aktif ? 1 : 0) : 1,
      });

      const newAdmin = await adminModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'tambah',
        jenis_entitas: 'pengguna',
        id_entitas: insertId,
        data_sesudah: { nama_pengguna: finalUsername, nama_lengkap, peran: finalRole },
      });

      return successResponse(res, 'Akun administrator berhasil dibuat', newAdmin, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { username, nama_pengguna, password, nama_lengkap, peran, role, aktif } = req.body;
      const finalUsername = nama_pengguna || username;

      const existing = await adminModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Akun administrator tidak ditemukan', [], 404);
      }

      // Check username uniqueness if changed
      if (finalUsername && finalUsername !== existing.nama_pengguna) {
        const dupCheck = await adminModel.findByUsername(finalUsername);
        if (dupCheck && dupCheck.id !== parseInt(id, 10)) {
          return errorResponse(res, 'Username sudah digunakan oleh akun lain', [], 400);
        }
      }

      const updateData = {};
      if (finalUsername) updateData.nama_pengguna = finalUsername;
      if (nama_lengkap) updateData.nama_lengkap = nama_lengkap;
      if (peran || role) {
        const targetRole = peran || role;
        if (!['admin', 'admin_utama'].includes(targetRole)) {
          return errorResponse(res, 'Peran tidak valid. Pilihan: admin atau admin_utama', [], 400);
        }
        updateData.peran = targetRole;
      }
      if (aktif !== undefined) {
        updateData.aktif = aktif ? 1 : 0;
      }
      if (password && password.trim() !== '') {
        updateData.hash_kata_sandi = await bcrypt.hash(password, 10);
      }

      await adminModel.update(id, updateData);
      const updated = await adminModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'ubah',
        jenis_entitas: 'pengguna',
        id_entitas: id,
        data_sebelum: { nama_pengguna: existing.nama_pengguna, nama_lengkap: existing.nama_lengkap, peran: existing.peran, aktif: existing.aktif },
        data_sesudah: { nama_pengguna: updated.nama_pengguna, nama_lengkap: updated.nama_lengkap, peran: updated.peran, aktif: updated.aktif },
      });

      return successResponse(res, 'Akun administrator berhasil diperbarui', updated);
    } catch (error) {
      next(error);
    }
  },

  toggleStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const targetId = parseInt(id, 10);

      // Prevent user from deactivating their own account
      if (req.admin && req.admin.id === targetId) {
        return errorResponse(res, 'Anda tidak dapat menonaktifkan akun Anda sendiri', [], 400);
      }

      const existing = await adminModel.findById(targetId);
      if (!existing) {
        return errorResponse(res, 'Akun administrator tidak ditemukan', [], 404);
      }

      const newStatus = existing.aktif ? 0 : 1;
      await adminModel.setActive(targetId, newStatus);
      const updated = await adminModel.findById(targetId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'ubah',
        jenis_entitas: 'pengguna',
        id_entitas: targetId,
        data_sebelum: { aktif: existing.aktif },
        data_sesudah: { aktif: newStatus },
      });

      const message = newStatus === 1 ? 'Akun administrator berhasil diaktifkan' : 'Akun administrator berhasil dinonaktifkan';
      return successResponse(res, message, updated);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const targetId = parseInt(id, 10);

      // Prevent admin from deleting themselves
      if (req.admin && targetId === req.admin.id) {
        return errorResponse(res, 'Anda tidak dapat menghapus akun admin Anda sendiri', [], 400);
      }

      const exists = await adminModel.findById(targetId);
      if (!exists) {
        return errorResponse(res, 'Akun administrator tidak ditemukan', [], 404);
      }

      // Check if referenced in beasiswa, pengumuman, or pengaturan_situs
      const isReferenced = await adminModel.isReferenced(targetId);
      if (isReferenced) {
        // Soft deactivate instead of hard delete to preserve foreign key integrity
        await adminModel.setActive(targetId, 0);

        await activityLogModel.log({
          pengguna_id: req.admin?.id,
          aksi: 'arsip',
          jenis_entitas: 'pengguna',
          id_entitas: targetId,
          data_sebelum: { nama_pengguna: exists.nama_pengguna, aktif: exists.aktif },
          data_sesudah: { aktif: false, alasan: 'Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan' },
        });

        return successResponse(
          res,
          'Akun memiliki riwayat data beasiswa/konten, sehingga status akun dinonaktifkan untuk menjaga integritas data.'
        );
      }

      // If not referenced, perform safe hard delete
      await adminModel.delete(targetId);

      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'pengguna',
        id_entitas: targetId,
        data_sebelum: { nama_pengguna: exists.nama_pengguna, nama_lengkap: exists.nama_lengkap },
      });

      return successResponse(res, 'Akun administrator berhasil dihapus');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
