const announcementModel = require('../models/announcementModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const announcementController = {
  // Public endpoint: returns active announcements within scheduled timeframe
  getPublic: async (req, res, next) => {
    try {
      const announcements = await announcementModel.findActivePublic();
      return successResponse(res, 'Daftar pengumuman publik berhasil dimuat', announcements);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint: returns all announcements
  getAll: async (req, res, next) => {
    try {
      const announcements = await announcementModel.findAll();
      return successResponse(res, 'Daftar seluruh pengumuman berhasil dimuat', announcements);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint: get announcement by id
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const announcement = await announcementModel.findById(id);
      if (!announcement) {
        return errorResponse(res, 'Pengumuman tidak ditemukan', [], 404);
      }
      return successResponse(res, 'Detail pengumuman berhasil dimuat', announcement);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint: create announcement
  create: async (req, res, next) => {
    try {
      const {
        judul,
        isi_pengumuman,
        url_tujuan,
        aktif,
        mulai_tayang,
        akhir_tayang,
        urutan_tampil,
      } = req.body;

      if (!judul || !judul.trim()) {
        return errorResponse(res, 'Judul pengumuman wajib diisi', [], 400);
      }
      if (!isi_pengumuman || !isi_pengumuman.trim()) {
        return errorResponse(res, 'Isi pengumuman wajib diisi', [], 400);
      }

      if (mulai_tayang && akhir_tayang) {
        const start = new Date(mulai_tayang);
        const end = new Date(akhir_tayang);
        if (end <= start) {
          return errorResponse(res, 'Waktu akhir tayang harus lebih besar dari mulai tayang', [], 400);
        }
      }

      const adminId = req.admin?.id || 1;

      const insertId = await announcementModel.create({
        judul: judul.trim(),
        isi_pengumuman: isi_pengumuman.trim(),
        url_tujuan: url_tujuan ? url_tujuan.trim() : null,
        aktif: aktif !== undefined ? (aktif ? 1 : 0) : 1,
        mulai_tayang: mulai_tayang || null,
        akhir_tayang: akhir_tayang || null,
        urutan_tampil: urutan_tampil !== undefined ? parseInt(urutan_tampil, 10) : 0,
        dibuat_oleh: adminId,
      });

      const newAnnouncement = await announcementModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'tambah',
        jenis_entitas: 'pengumuman',
        id_entitas: insertId,
        data_sesudah: {
          judul: newAnnouncement.judul,
          aktif: newAnnouncement.aktif,
          urutan_tampil: newAnnouncement.urutan_tampil,
        },
      });

      return successResponse(res, 'Pengumuman berhasil dibuat', newAnnouncement, 201);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint: update announcement
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await announcementModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Pengumuman tidak ditemukan', [], 404);
      }

      const {
        judul,
        isi_pengumuman,
        url_tujuan,
        aktif,
        mulai_tayang,
        akhir_tayang,
        urutan_tampil,
      } = req.body;

      const finalMulai = mulai_tayang !== undefined ? mulai_tayang : existing.mulai_tayang;
      const finalAkhir = akhir_tayang !== undefined ? akhir_tayang : existing.akhir_tayang;

      if (finalMulai && finalAkhir) {
        const start = new Date(finalMulai);
        const end = new Date(finalAkhir);
        if (end <= start) {
          return errorResponse(res, 'Waktu akhir tayang harus lebih besar dari mulai tayang', [], 400);
        }
      }

      const adminId = req.admin?.id || 1;

      const updateData = {
        diperbarui_oleh: adminId,
      };

      if (judul !== undefined) updateData.judul = judul.trim();
      if (isi_pengumuman !== undefined) updateData.isi_pengumuman = isi_pengumuman.trim();
      if (url_tujuan !== undefined) updateData.url_tujuan = url_tujuan ? url_tujuan.trim() : null;
      if (aktif !== undefined) updateData.aktif = aktif ? 1 : 0;
      if (mulai_tayang !== undefined) updateData.mulai_tayang = mulai_tayang || null;
      if (akhir_tayang !== undefined) updateData.akhir_tayang = akhir_tayang || null;
      if (urutan_tampil !== undefined) updateData.urutan_tampil = parseInt(urutan_tampil, 10) || 0;

      await announcementModel.update(id, updateData);
      const updated = await announcementModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'ubah',
        jenis_entitas: 'pengumuman',
        id_entitas: id,
        data_sebelum: {
          judul: existing.judul,
          aktif: existing.aktif,
          urutan_tampil: existing.urutan_tampil,
        },
        data_sesudah: {
          judul: updated.judul,
          aktif: updated.aktif,
          urutan_tampil: updated.urutan_tampil,
        },
      });

      return successResponse(res, 'Pengumuman berhasil diperbarui', updated);
    } catch (error) {
      next(error);
    }
  },

  // Admin endpoint: delete announcement
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await announcementModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Pengumuman tidak ditemukan', [], 404);
      }

      await announcementModel.delete(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'pengumuman',
        id_entitas: id,
        data_sebelum: {
          judul: existing.judul,
          aktif: existing.aktif,
        },
      });

      return successResponse(res, 'Pengumuman berhasil dihapus', { id });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = announcementController;
