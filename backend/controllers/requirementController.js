const requirementModel = require('../models/requirementModel');
const scholarshipModel = require('../models/scholarshipModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const requirementController = {
  getAll: async (req, res, next) => {
    try {
      const requirements = await requirementModel.findAll();
      return successResponse(res, 'Daftar persyaratan berhasil dimuat', requirements);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const requirement = await requirementModel.findById(id);
      if (!requirement) {
        return errorResponse(res, 'Persyaratan tidak ditemukan', [], 404);
      }
      return successResponse(res, 'Data persyaratan berhasil dimuat', requirement);
    } catch (error) {
      next(error);
    }
  },

  getByScholarship: async (req, res, next) => {
    try {
      const { scholarshipId } = req.params;
      const requirements = await requirementModel.findByScholarshipId(scholarshipId);
      return successResponse(res, 'Daftar persyaratan beasiswa berhasil dimuat', requirements);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { beasiswa_id, nama_persyaratan, dokumen_persyaratan, jenis_persyaratan, wajib, urutan_tampil } = req.body;

      const scholarship = await scholarshipModel.findById(beasiswa_id);
      if (!scholarship) {
        return errorResponse(res, 'Program beasiswa yang dirujuk tidak ditemukan', [], 404);
      }

      const finalNama = nama_persyaratan || dokumen_persyaratan;
      const insertId = await requirementModel.create({
        beasiswa_id: parseInt(beasiswa_id, 10),
        nama_persyaratan: finalNama,
        jenis_persyaratan: jenis_persyaratan || 'umum',
        wajib: wajib !== undefined ? (wajib ? 1 : 0) : 1,
        urutan_tampil: parseInt(urutan_tampil, 10) || 0,
      });

      const newRequirement = await requirementModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'tambah',
        jenis_entitas: 'persyaratan_beasiswa',
        id_entitas: insertId,
        data_sesudah: { beasiswa_id, nama_persyaratan: finalNama },
      });

      return successResponse(res, 'Persyaratan beasiswa berhasil ditambahkan', newRequirement, 201);
    } catch (error) {
      next(error);
    }
  },

  createBulk: async (req, res, next) => {
    try {
      const { beasiswa_id, requirements, replaceExisting = true } = req.body;

      if (!beasiswa_id || !Array.isArray(requirements)) {
        return errorResponse(res, "Field 'beasiswa_id' dan array 'requirements' wajib diisi", [], 400);
      }

      const scholarship = await scholarshipModel.findById(beasiswa_id);
      if (!scholarship) {
        return errorResponse(res, 'Program beasiswa yang dirujuk tidak ditemukan', [], 404);
      }

      if (replaceExisting) {
        await requirementModel.deleteByScholarshipId(beasiswa_id);
      }

      const insertedIds = await requirementModel.createBulk(beasiswa_id, requirements);
      const updatedList = await requirementModel.findByScholarshipId(beasiswa_id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'tambah',
        jenis_entitas: 'persyaratan_beasiswa',
        id_entitas: beasiswa_id,
        data_sesudah: { beasiswa_id, total_persyaratan: updatedList.length },
      });

      return successResponse(res, 'Persyaratan beasiswa berhasil diperbarui', updatedList, 200);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { beasiswa_id, nama_persyaratan, dokumen_persyaratan, jenis_persyaratan, wajib, urutan_tampil } = req.body;

      const existing = await requirementModel.findById(id);
      if (!existing) {
        return errorResponse(res, 'Persyaratan tidak ditemukan', [], 404);
      }

      if (beasiswa_id && parseInt(beasiswa_id, 10) !== existing.beasiswa_id) {
        const scholarship = await scholarshipModel.findById(beasiswa_id);
        if (!scholarship) {
          return errorResponse(res, 'Program beasiswa yang dirujuk tidak ditemukan', [], 404);
        }
      }

      const finalNama = nama_persyaratan || dokumen_persyaratan;
      await requirementModel.update(id, {
        beasiswa_id: beasiswa_id ? parseInt(beasiswa_id, 10) : undefined,
        nama_persyaratan: finalNama,
        jenis_persyaratan,
        wajib,
        urutan_tampil,
      });

      const updated = await requirementModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'ubah',
        jenis_entitas: 'persyaratan_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_persyaratan: existing.nama_persyaratan },
        data_sesudah: { nama_persyaratan: updated.nama_persyaratan },
      });

      return successResponse(res, 'Persyaratan berhasil diperbarui', updated);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await requirementModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Persyaratan tidak ditemukan', [], 404);
      }

      await requirementModel.delete(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'persyaratan_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_persyaratan: exists.nama_persyaratan, beasiswa_id: exists.beasiswa_id },
      });

      return successResponse(res, 'Persyaratan berhasil dihapus');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = requirementController;
