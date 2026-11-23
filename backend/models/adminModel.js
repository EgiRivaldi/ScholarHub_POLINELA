const { pool } = require('../config/database');

// Helper to map DB row to API-friendly format (supports both Indonesian and legacy English keys)
const formatUserRow = (row, includePassword = false) => {
  if (!row) return null;
  const user = {
    id: row.id,
    nama_pengguna: row.nama_pengguna,
    username: row.nama_pengguna, // legacy alias
    nama_lengkap: row.nama_lengkap,
    peran: row.peran,
    role: row.peran, // legacy alias
    aktif: Boolean(row.aktif),
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
  };
  if (includePassword) {
    user.hash_kata_sandi = row.hash_kata_sandi;
    user.password = row.hash_kata_sandi; // legacy alias
  }
  return user;
};

const Admin = {
  findByUsername: async (username) => {
    const [rows] = await pool.query(
      'SELECT id, nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif, dibuat_pada, diperbarui_pada FROM pengguna WHERE nama_pengguna = ? LIMIT 1',
      [username]
    );
    if (!rows || rows.length === 0) return null;
    return formatUserRow(rows[0], true);
  },

  findById: async (id, includePassword = false) => {
    const [rows] = await pool.query(
      'SELECT id, nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif, dibuat_pada, diperbarui_pada FROM pengguna WHERE id = ? LIMIT 1',
      [id]
    );
    if (!rows || rows.length === 0) return null;
    return formatUserRow(rows[0], includePassword);
  },

  findAll: async () => {
    const [rows] = await pool.query(
      'SELECT id, nama_pengguna, nama_lengkap, peran, aktif, dibuat_pada, diperbarui_pada FROM pengguna ORDER BY id ASC'
    );
    return rows.map(r => formatUserRow(r, false));
  },

  create: async (adminData) => {
    const nama_pengguna = adminData.nama_pengguna || adminData.username;
    const hash_kata_sandi = adminData.hash_kata_sandi || adminData.password;
    const nama_lengkap = adminData.nama_lengkap;
    const peran = adminData.peran || adminData.role || 'admin';
    const aktif = adminData.aktif !== undefined ? (adminData.aktif ? 1 : 0) : 1;

    const [result] = await pool.query(
      'INSERT INTO pengguna (nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif) VALUES (?, ?, ?, ?, ?)',
      [nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif]
    );
    return result.insertId;
  },

  update: async (id, adminData) => {
    const updates = [];
    const values = [];

    if (adminData.nama_pengguna || adminData.username) {
      updates.push('nama_pengguna = ?');
      values.push(adminData.nama_pengguna || adminData.username);
    }
    if (adminData.hash_kata_sandi || adminData.password) {
      updates.push('hash_kata_sandi = ?');
      values.push(adminData.hash_kata_sandi || adminData.password);
    }
    if (adminData.nama_lengkap !== undefined) {
      updates.push('nama_lengkap = ?');
      values.push(adminData.nama_lengkap);
    }
    if (adminData.peran || adminData.role) {
      updates.push('peran = ?');
      values.push(adminData.peran || adminData.role);
    }
    if (adminData.aktif !== undefined) {
      updates.push('aktif = ?');
      values.push(adminData.aktif ? 1 : 0);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE pengguna SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  setActive: async (id, aktif) => {
    const [result] = await pool.query(
      'UPDATE pengguna SET aktif = ? WHERE id = ?',
      [aktif ? 1 : 0, id]
    );
    return result.affectedRows;
  },

  isReferenced: async (id) => {
    const [beasiswaRows] = await pool.query(
      'SELECT COUNT(*) as cnt FROM beasiswa WHERE dibuat_oleh = ? OR diperbarui_oleh = ?',
      [id, id]
    );
    const [pengumumanRows] = await pool.query(
      'SELECT COUNT(*) as cnt FROM pengumuman WHERE dibuat_oleh = ? OR diperbarui_oleh = ?',
      [id, id]
    );
    return (beasiswaRows[0].cnt > 0) || (pengumumanRows[0].cnt > 0);
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM pengguna WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Admin;
