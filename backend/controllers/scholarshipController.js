const scholarshipModel = require('../models/scholarshipModel');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/responseHelper');
const { deleteImageFile } = require('../utils/fileHelper');

const scholarshipController = {
  getAll: async (req, res, next) => {
    try {
      const { search, kategori_id, status, page = 1, limit = 10, sort = 'id', order = 'DESC' } = req.query;

      const filters = {
        search,
        kategori_id,
        status,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort,
        order,
      };

      const total = await scholarshipModel.count(filters);
      const scholarships = await scholarshipModel.findAll(filters);

      const totalPages = Math.ceil(total / filters.limit);

      const pagination = {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages,
      };

      return paginatedResponse(res, 'Scholarships retrieved successfully', scholarships, pagination);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const scholarship = await scholarshipModel.findById(id);
      if (!scholarship) {
        return errorResponse(res, 'Scholarship not found', [], 404);
      }
      return successResponse(res, 'Scholarship retrieved successfully', scholarship);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama_beasiswa, deskripsi, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id } = req.body;
      const gambar = req.file ? `/uploads/${req.file.filename}` : null;

      const insertId = await scholarshipModel.create({
        nama_beasiswa,
        deskripsi: deskripsi || null,
        gambar,
        tanggal_buka,
        tanggal_tutup,
        url_pendaftaran,
        kategori_id: parseInt(kategori_id, 10),
        penyedia_id: parseInt(penyedia_id, 10),
      });

      const newScholarship = await scholarshipModel.findById(insertId);
      return successResponse(res, 'Scholarship created successfully', newScholarship, 201);
    } catch (error) {
      // Clean up uploaded image if DB insertion fails
      if (req.file) {
        await deleteImageFile(`/uploads/${req.file.filename}`);
      }
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_beasiswa, deskripsi, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id } = req.body;

      const existing = await scholarshipModel.findById(id);
      if (!existing) {
        if (req.file) {
          await deleteImageFile(`/uploads/${req.file.filename}`);
        }
        return errorResponse(res, 'Scholarship not found', [], 404);
      }

      let gambar = existing.gambar;
      let oldGambarToDelete = null;
      if (req.file) {
        oldGambarToDelete = existing.gambar;
        gambar = `/uploads/${req.file.filename}`;
      }

      await scholarshipModel.update(id, {
        nama_beasiswa,
        deskripsi: deskripsi || null,
        gambar,
        tanggal_buka,
        tanggal_tutup,
        url_pendaftaran,
        kategori_id: parseInt(kategori_id, 10),
        penyedia_id: parseInt(penyedia_id, 10),
      });

      // Delete old image only after successful database update
      if (oldGambarToDelete) {
        await deleteImageFile(oldGambarToDelete);
      }

      const updated = await scholarshipModel.findById(id);
      return successResponse(res, 'Scholarship updated successfully', updated);
    } catch (error) {
      // Clean up uploaded image if DB update fails
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
        return errorResponse(res, 'Scholarship not found', [], 404);
      }

      // Delete image file first
      await deleteImageFile(existing.gambar);

      await scholarshipModel.delete(id);
      return successResponse(res, 'Scholarship deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = scholarshipController;
