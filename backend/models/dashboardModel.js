const { pool } = require('../config/database');

const dashboardModel = {
  getStats: async () => {
    const [scholarshipCount] = await pool.query('SELECT COUNT(*) as total FROM informasi_beasiswa');
    const [categoryCount] = await pool.query('SELECT COUNT(*) as total FROM kategori_beasiswa');
    const [providerCount] = await pool.query('SELECT COUNT(*) as total FROM penyedia_beasiswa');
    const [activeCount] = await pool.query('SELECT COUNT(*) as total FROM informasi_beasiswa WHERE tanggal_tutup >= CURDATE()');

    return {
      totalScholarships: scholarshipCount[0].total,
      totalCategories: categoryCount[0].total,
      totalProviders: providerCount[0].total,
      activeScholarships: activeCount[0].total,
    };
  },

  getRecentScholarships: async (limit = 5) => {
    const sql = `
      SELECT i.*, k.nama_kategori, p.nama_penyedia, p.singkatan as penyedia_singkatan,
             CASE WHEN i.tanggal_tutup >= CURDATE() THEN 'active' ELSE 'closed' END as status
      FROM informasi_beasiswa i
      LEFT JOIN kategori_beasiswa k ON i.kategori_id = k.id
      LEFT JOIN penyedia_beasiswa p ON i.penyedia_id = p.id
      ORDER BY i.id DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);
    return rows;
  },
};

module.exports = dashboardModel;
