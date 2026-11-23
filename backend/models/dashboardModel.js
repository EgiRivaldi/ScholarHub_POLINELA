const { pool } = require('../config/database');
const scholarshipModel = require('./scholarshipModel');

const dashboardModel = {
  getStats: async () => {
    const [[scholarshipRows], [categoryRows], [providerRows], [activeRows], [draftRows], [archiveRows]] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM beasiswa'),
      pool.query('SELECT COUNT(*) AS total FROM kategori_beasiswa'),
      pool.query('SELECT COUNT(*) AS total FROM penyelenggara_beasiswa'),
      pool.query("SELECT COUNT(*) AS total FROM beasiswa WHERE status_publikasi = 'terbit' AND (tanggal_tutup IS NULL OR tanggal_tutup >= CURDATE())"),
      pool.query("SELECT COUNT(*) AS total FROM beasiswa WHERE status_publikasi = 'draf'"),
      pool.query("SELECT COUNT(*) AS total FROM beasiswa WHERE status_publikasi = 'arsip'"),
    ]);

    return {
      totalScholarships: Number(scholarshipRows[0]?.total || 0),
      totalCategories: Number(categoryRows[0]?.total || 0),
      totalProviders: Number(providerRows[0]?.total || 0),
      activeScholarships: Number(activeRows[0]?.total || 0),
      totalDrafts: Number(draftRows[0]?.total || 0),
      totalArchived: Number(archiveRows[0]?.total || 0),
    };
  },

  getRecentScholarships: async (limit = 5) => {
    return scholarshipModel.findAll({
      limit,
      page: 1,
      sort: 'id',
      order: 'DESC',
    });
  },
};

module.exports = dashboardModel;
