const settingModel = require('../models/settingModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const settingController = {
  // Public endpoint: returns only key-value pairs where tampil_publik = 1
  getPublic: async (req, res, next) => {
    try {
      const publicSettings = await settingModel.findPublic();
      return successResponse(res, 'Pengaturan publik berhasil dimuat', publicSettings);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint (admin_utama only): returns all settings with full metadata
  getAll: async (req, res, next) => {
    try {
      const settings = await settingModel.findAll();
      return successResponse(res, 'Seluruh pengaturan situs berhasil dimuat', settings);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint (admin_utama only): update multiple settings at once
  updateBulk: async (req, res, next) => {
    try {
      const settingsPayload = req.body.settings || req.body;
      if (!settingsPayload || typeof settingsPayload !== 'object' || Array.isArray(settingsPayload)) {
        return errorResponse(res, 'Payload pengaturan harus berupa object key-value', [], 400);
      }

      const adminId = req.admin?.id || 1;
      const count = await settingModel.updateBulk(settingsPayload, adminId);
      const updatedSettings = await settingModel.findAll();

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'ubah',
        jenis_entitas: 'pengaturan_situs',
        id_entitas: null,
        data_sesudah: settingsPayload,
      });

      return successResponse(res, `${count} pengaturan situs berhasil diperbarui`, updatedSettings);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint (admin_utama only): update a single setting by key
  updateByKey: async (req, res, next) => {
    try {
      const { key } = req.params;
      const { nilai_pengaturan, value } = req.body;
      const valToSet = nilai_pengaturan !== undefined ? nilai_pengaturan : value;

      const existing = await settingModel.findByKey(key);
      if (!existing) {
        return errorResponse(res, `Pengaturan dengan kunci '${key}' tidak ditemukan`, [], 404);
      }

      const adminId = req.admin?.id || 1;
      await settingModel.updateByKey(key, valToSet, adminId);
      const updated = await settingModel.findByKey(key);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'ubah',
        jenis_entitas: 'pengaturan_situs',
        id_entitas: existing.id,
        data_sebelum: { kunci_pengaturan: key, nilai_pengaturan: existing.nilai_pengaturan },
        data_sesudah: { kunci_pengaturan: key, nilai_pengaturan: updated.nilai_pengaturan },
      });

      return successResponse(res, `Pengaturan '${key}' berhasil diperbarui`, updated);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = settingController;
