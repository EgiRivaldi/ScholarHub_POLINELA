const { pool } = require('../config/database');

const adminModel = {
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      'SELECT id, username, password, nama_lengkap, created_at, updated_at FROM akun_admin WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  },

  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, username, nama_lengkap, created_at, updated_at FROM akun_admin ORDER BY id DESC'
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, username, nama_lengkap, created_at, updated_at FROM akun_admin WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async ({ username, password, nama_lengkap }) => {
    const [result] = await pool.query(
      'INSERT INTO akun_admin (username, password, nama_lengkap) VALUES (?, ?, ?)',
      [username, password, nama_lengkap]
    );
    return result.insertId;
  },

  update: async (id, { username, nama_lengkap, password }) => {
    if (password) {
      const [result] = await pool.query(
        'UPDATE akun_admin SET username = ?, nama_lengkap = ?, password = ? WHERE id = ?',
        [username, nama_lengkap, password, id]
      );
      return result.affectedRows > 0;
    } else {
      const [result] = await pool.query(
        'UPDATE akun_admin SET username = ?, nama_lengkap = ? WHERE id = ?',
        [username, nama_lengkap, id]
      );
      return result.affectedRows > 0;
    }
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM akun_admin WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = adminModel;
