const providerModel = require('../models/providerModel');
const activityLogModel = require('../models/activityLogModel');
const { successResponse, errorResponse } = require('../utils/responseHelper');

const providerController = {
  getAll: async (req, res, next) => {
    try {
      const providers = await providerModel.findAll();
      return successResponse(res, 'Daftar penyelenggara berhasil dimuat', providers);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const provider = await providerModel.findById(id);
      if (!provider) {
        return errorResponse(res, 'Penyelenggara tidak ditemukan', [], 404);
      }
      return successResponse(res, 'Data penyelenggara berhasil dimuat', provider);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama_penyelenggara, nama_penyedia, url_website, website, email_kontak, kontak, alamat, deskripsi } = req.body;
      const finalName = nama_penyelenggara || nama_penyedia;

      const insertId = await providerModel.create({
        nama_penyelenggara: finalName,
        url_website: url_website || website,
        email_kontak: email_kontak || kontak,
        alamat,
        deskripsi,
      });

      const newProvider = await providerModel.findById(insertId);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'tambah',
        jenis_entitas: 'penyelenggara_beasiswa',
        id_entitas: insertId,
        data_sesudah: { nama_penyelenggara: finalName },
      });

      return successResponse(res, 'Penyelenggara beasiswa berhasil dibuat', newProvider, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nama_penyelenggara, nama_penyedia, url_website, website, email_kontak, kontak, alamat, deskripsi } = req.body;

      const exists = await providerModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Penyelenggara tidak ditemukan', [], 404);
      }

      const finalName = nama_penyelenggara || nama_penyedia;
      await providerModel.update(id, {
        nama_penyelenggara: finalName,
        url_website: url_website || website,
        email_kontak: email_kontak || kontak,
        alamat,
        deskripsi,
      });

      const updatedProvider = await providerModel.findById(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'ubah',
        jenis_entitas: 'penyelenggara_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_penyelenggara: exists.nama_penyelenggara },
        data_sesudah: { nama_penyelenggara: updatedProvider.nama_penyelenggara },
      });

      return successResponse(res, 'Penyelenggara beasiswa berhasil diperbarui', updatedProvider);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const exists = await providerModel.findById(id);
      if (!exists) {
        return errorResponse(res, 'Penyelenggara tidak ditemukan', [], 404);
      }

      // Check if provider has associated scholarships
      if (exists.total_beasiswa > 0) {
        return errorResponse(
          res,
          `Penyelenggara '${exists.nama_penyelenggara}' tidak dapat dihapus karena masih digunakan oleh ${exists.total_beasiswa} program beasiswa.`,
          [],
          400
        );
      }

      await providerModel.delete(id);

      // Record activity log
      await activityLogModel.log({
        pengguna_id: req.admin?.id,
        aksi: 'hapus',
        jenis_entitas: 'penyelenggara_beasiswa',
        id_entitas: id,
        data_sebelum: { nama_penyelenggara: exists.nama_penyelenggara },
      });

      return successResponse(res, 'Penyelenggara beasiswa berhasil dihapus');
    } catch (error) {
      next(error);
    }
  },
};

module.exports = providerController;
