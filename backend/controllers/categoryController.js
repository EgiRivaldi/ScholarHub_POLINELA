const categoryModel = require('../models/categoryModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryModel.findAll();
      return successResponse(res, 'Daftar kategori berhasil dimuat', categories);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = isNaN(id) ? await categoryModel.findBySlug(id) : await categoryModel.findById(id);
      if (!category) {
        return errorResponse(res, 'Kategori tidak ditemukan', [], 404);
      }
      return successResponse(res, 'Data kategori berhasil dimuat', category);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama_kategori, slug, deskripsi } = req.body;
      const insertId = await categoryModel.create({ nama_kategori, slug, deskripsi });
      const newCategory = await categoryModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'tambah',
        jenis_entitas: 'kategori_beasiswa',
        id_entitas: insertId,
        data_sesudah: { nama_kategori, slug: newCategory.slug },
      });

      return successResponse(res, 'Kategori beasiswa berhasil dibuat', newCategory, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_kategori, slug, deskripsi } = req.body;

      const exists = await categoryModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Kategori tidak ditemukan', [], 404);
      }

      await categoryModel.update(id, { nama_kategori, slug, deskripsi });
      const updatedCategory = await categoryModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'ubah',
        jenis_entitas: 'kategori_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_kategori: exists.nama_kategori },
        data_sesudah: { nama_kategori: updatedCategory.nama_kategori },
      });

      return successResponse(res, 'Kategori beasiswa berhasil diperbarui', updatedCategory);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await categoryModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Kategori tidak ditemukan', [], 404);
      }

      // Check if category has associated scholarships
      if (exists.total_beasiswa > 0) {
        return errorResponse(
          res,
          `Kategori '${exists.nama_kategori}' tidak dapat dihapus karena masih digunakan oleh ${exists.total_beasiswa} program beasiswa.`,
          [],
          400
        );
      }

      await categoryModel.delete(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'kategori_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_kategori: exists.nama_kategori },
      });

      return successResponse(res, 'Kategori beasiswa berhasil dihapus');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
