const scholarshipModel = require('../models/scholarshipModel');
const requirementModel = require('../models/requirementModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const { deleteImageFile } = require('../utils/fileHelper');

const scholarshipController = {
  getAll: async (req, res, next) => {
    try {
      const {
        search,
        kategori_id,
        penyelenggara_id,
        penyedia_id,
        status_publikasi,
        status_pendaftaran,
        status,
        page = 1,
        limit = 10,
        sort = 'id',
        order = 'DESC',
      } = req.query;

      const filters = {
        search,
        kategori_id: kategori_id ? parseInt(kategori_id, 10) : undefined,
        penyelenggara_id: (penyelenggara_id || penyedia_id) ? parseInt(penyelenggara_id || penyedia_id, 10) : undefined,
        status_pendaftaran,
        status,
        page: Math.max(1, parseInt(page, 10) || 1),
        limit: Math.max(1, parseInt(limit, 10) || 10),
        sort,
        order,
      };

      // Strict Business Rule: Public visitors (without admin session) only see 'terbit' scholarships
      if (!req.admin) {
        filters.status_publikasi = 'terbit';
      } else if (status_publikasi) {
        filters.status_publikasi = status_publikasi;
      }

      const total = await scholarshipModel.count(filters);
      const scholarships = await scholarshipModel.findAll(filters);

      const totalPages = Math.ceil(total / filters.limit);

      const pagination = {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      };

      return paginatedResponse(res, 'Daftar beasiswa berhasil dimuat', scholarships, pagination);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      // Allow lookup by numeric ID or by SEO slug
      let scholarship = null;
      if (/^\d+$/.test(id)) {
        scholarship = await scholarshipModel.findById(id);
      } else {
        scholarship = await scholarshipModel.findBySlug(id);
      }

      if (!scholarship) {
        return errorResponse(res, 'Informasi beasiswa tidak ditemukan', [], 404);
      }

      // Public visitors cannot see unpublished drafts
      if (!req.admin && scholarship.status_publikasi !== 'terbit') {
        return errorResponse(res, 'Informasi beasiswa tidak ditemukan atau belum diterbitkan', [], 404);
      }

      // Automatically attach requirements list for the detail page
      const requirements = await requirementModel.findByScholarshipId(scholarship.id);
      scholarship.persyaratan = requirements;

      return successResponse(res, 'Detail beasiswa berhasil dimuat', scholarship);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        judul,
        nama_beasiswa,
        slug,
        ringkasan,
        deskripsi,
        tanggal_buka,
        tanggal_tutup,
        url_pendaftaran,
        url_sumber_resmi,
        kategori_id,
        penyelenggara_id,
        penyedia_id,
        status_publikasi,
      } = req.body;

      const finalJudul = judul || nama_beasiswa;
      const finalPenyelenggaraId = penyelenggara_id || penyedia_id;
      const gambar = req.file ? `/uploads/${req.file.filename}` : null;
      const adminId = req.admin?.id || 1;

      const insertId = await scholarshipModel.create({
        judul: finalJudul,
        slug,
        ringkasan: ringkasan || null,
        deskripsi: deskripsi || null,
        url_gambar: gambar,
        gambar,
        tanggal_buka: tanggal_buka || null,
        tanggal_tutup: tanggal_tutup || null,
        url_pendaftaran: url_pendaftaran || null,
        url_sumber_resmi: url_sumber_resmi || null,
        kategori_id: parseInt(kategori_id, 10),
        penyelenggara_id: parseInt(finalPenyelenggaraId, 10),
        status_publikasi: status_publikasi || 'terbit',
        dibuat_oleh: adminId,
      });

      const newScholarship = await scholarshipModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'tambah',
        jenis_entitas: 'beasiswa',
        id_entitas: insertId,
        data_sesudah: { judul: finalJudul, status_publikasi: newScholarship.status_publikasi },
      });

      return successResponse(res, 'Program beasiswa berhasil dibuat', newScholarship, 201);
    } catch (error) {
      if (req.file) {
        await deleteImageFile(`/uploads/${req.file.filename}`);
      }
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        judul,
        nama_beasiswa,
        slug,
        ringkasan,
        deskripsi,
        tanggal_buka,
        tanggal_tutup,
        url_pendaftaran,
        url_sumber_resmi,
        kategori_id,
        penyelenggara_id,
        penyedia_id,
        status_publikasi,
      } = req.body;

      const existing = await scholarshipModel.findById(id);
      if (!existing) {
        if (req.file) {
          await deleteImageFile(`/uploads/${req.file.filename}`);
        }
        return errorResponse(res, 'Informasi beasiswa tidak ditemukan', [], 404);
      }

      let gambar = existing.url_gambar;
      let oldGambarToDelete = null;
      if (req.file) {
        oldGambarToDelete = existing.url_gambar;
        gambar = `/uploads/${req.file.filename}`;
      }

      const finalJudul = judul || nama_beasiswa;
      const finalPenyelenggaraId = penyelenggara_id || penyedia_id;
      const adminId = req.admin?.id || 1;

      await scholarshipModel.update(id, {
        judul: finalJudul,
        slug,
        ringkasan,
        deskripsi,
        url_gambar: gambar,
        gambar,
        tanggal_buka,
        tanggal_tutup,
        url_pendaftaran,
        url_sumber_resmi,
        kategori_id: kategori_id ? parseInt(kategori_id, 10) : undefined,
        penyelenggara_id: finalPenyelenggaraId ? parseInt(finalPenyelenggaraId, 10) : undefined,
        status_publikasi,
        diperbarui_oleh: adminId,
      });

      if (oldGambarToDelete) {
        await deleteImageFile(oldGambarToDelete);
      }

      const updated = await scholarshipModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: adminId,
        aksi: 'ubah',
        jenis_entitas: 'beasiswa',
        id_entitas: id,
        data_sebelum: { judul: existing.judul, status_publikasi: existing.status_publikasi },
        data_sesudah: { judul: updated.judul, status_publikasi: updated.status_publikasi },
      });

      return successResponse(res, 'Program beasiswa berhasil diperbarui', updated);
    } catch (error) {
      if (req.file) {
        await deleteImageFile(`/uploads/${req.file.filename}`);
      }
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await scholarshipModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Informasi beasiswa tidak ditemukan', [], 404);
      }

      if (existing.url_gambar) {
        await deleteImageFile(existing.url_gambar);
      }

      await scholarshipModel.delete(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'beasiswa',
        id_entitas: id,
        data_sebelum: { judul: existing.judul },
      });

      return successResponse(res, 'Program beasiswa berhasil dihapus');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = scholarshipController;
