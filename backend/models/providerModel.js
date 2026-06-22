const { pool } = require('../config/database');

const providerModel = {
  findAll: async () => {
    const [rows] = await pool.query('SELECT * FROM penyedia_beasiswa ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM penyedia_beasiswa WHERE id = ?', [id]);
    return rows[0] || null;
  },

  create: async ({ nama_penyedia, singkatan, website, logo }) => {
    const [result] = await pool.query(
      'INSERT INTO penyedia_beasiswa (nama_penyedia, singkatan, website, logo) VALUES (?, ?, ?, ?)',
      [nama_penyedia, singkatan, website, logo]
    );
    return result.insertId;
  },

  update: async (id, { nama_penyedia, singkatan, website, logo }) => {
    const [result] = await pool.query(
      'UPDATE penyedia_beasiswa SET nama_penyedia = ?, singkatan = ?, website = ?, logo = ? WHERE id = ?',
      [nama_penyedia, singkatan, website, logo, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM penyedia_beasiswa WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  count: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM penyedia_beasiswa');
    return rows[0].total;
  },
};

module.exports = providerModel;
