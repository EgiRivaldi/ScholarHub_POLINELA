const { pool } = require('../config/database');

const categoryModel = {
  findAll: async () => {
    const sql = `
      SELECT k.*, COUNT(i.id) as jumlah_beasiswa
      FROM kategori_beasiswa k
      LEFT JOIN informasi_beasiswa i ON k.id = i.kategori_id
      GROUP BY k.id
      ORDER BY k.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM kategori_beasiswa WHERE id = ?', [id]);
    return rows[0] || null;
  },

  create: async ({ nama_kategori, deskripsi }) => {
    const [result] = await pool.query(
      'INSERT INTO kategori_beasiswa (nama_kategori, deskripsi) VALUES (?, ?)',
      [nama_kategori, deskripsi]
    );
    return result.insertId;
  },

  update: async (id, { nama_kategori, deskripsi }) => {
    const [result] = await pool.query(
      'UPDATE kategori_beasiswa SET nama_kategori = ?, deskripsi = ? WHERE id = ?',
      [nama_kategori, deskripsi, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM kategori_beasiswa WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  count: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM kategori_beasiswa');
    return rows[0].total;
  },
};

module.exports = categoryModel;
