const { pool } = require('../config/database');

const ActivityLog = {
  log: async ({ pengguna_id, aksi, jenis_entitas, id_entitas, data_sebelum = null, data_sesudah = null }) => {
    try {
      // Ensure JSON strings, strip sensitive keys if present
      const cleanData = (obj) => {
        if (!obj) return null;
        if (typeof obj === 'string') return obj;
        const cloned = { ...obj };
        delete cloned.hash_kata_sandi;
        delete cloned.password;
        delete cloned.token;
        return JSON.stringify(cloned);
      };

      const sebelumStr = cleanData(data_sebelum);
      const sesudahStr = cleanData(data_sesudah);

      const [result] = await pool.query(
        `INSERT INTO log_aktivitas (pengguna_id, aksi, jenis_entitas, id_entitas, data_sebelum, data_sesudah)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [pengguna_id || null, aksi, jenis_entitas, id_entitas || null, sebelumStr, sesudahStr]
      );
      return result.insertId;
    } catch (error) {
      console.error('Failed to write activity log:', error.message);
      return null;
    }
  },

  findAll: async (filters = {}) => {
    let query = `
      SELECT 
        l.id,
        l.pengguna_id,
        l.aksi,
        l.jenis_entitas,
        l.id_entitas,
        l.data_sebelum,
        l.data_sesudah,
        l.dibuat_pada,
        u.nama_pengguna,
        u.nama_lengkap,
        u.peran
      FROM log_aktivitas l
      LEFT JOIN pengguna u ON u.id = l.pengguna_id
    `;
    const whereClauses = [];
    const params = [];

    if (filters.pengguna_id) {
      whereClauses.push('l.pengguna_id = ?');
      params.push(filters.pengguna_id);
    }
    if (filters.aksi) {
      whereClauses.push('l.aksi = ?');
      params.push(filters.aksi);
    }
    if (filters.jenis_entitas) {
      whereClauses.push('l.jenis_entitas = ?');
      params.push(filters.jenis_entitas);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' ORDER BY l.id DESC';

    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.max(1, parseInt(filters.limit, 10) || 20);
    const offset = (page - 1) * limit;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows.map((r) => {
      let dataSebelum = null;
      let dataSesudah = null;
      try {
        if (r.data_sebelum) dataSebelum = JSON.parse(r.data_sebelum);
      } catch (e) {}
      try {
        if (r.data_sesudah) dataSesudah = JSON.parse(r.data_sesudah);
      } catch (e) {}

      return {
        id: r.id,
        pengguna_id: r.pengguna_id,
        nama_pengguna: r.nama_pengguna,
        nama_lengkap: r.nama_lengkap,
        peran: r.peran,
        aksi: r.aksi,
        jenis_entitas: r.jenis_entitas,
        id_entitas: r.id_entitas,
        data_sebelum: dataSebelum,
        data_sesudah: dataSesudah,
        dibuat_pada: r.dibuat_pada,
      };
    });
  },

  count: async (filters = {}) => {
    let query = 'SELECT COUNT(id) AS total FROM log_aktivitas';
    const whereClauses = [];
    const params = [];

    if (filters.pengguna_id) {
      whereClauses.push('pengguna_id = ?');
      params.push(filters.pengguna_id);
    }
    if (filters.aksi) {
      whereClauses.push('aksi = ?');
      params.push(filters.aksi);
    }
    if (filters.jenis_entitas) {
      whereClauses.push('jenis_entitas = ?');
      params.push(filters.jenis_entitas);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);
    return Number(rows[0]?.total || 0);
  },
};

module.exports = ActivityLog;
