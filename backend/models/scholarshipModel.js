const { pool } = require('../config/database');

const scholarshipModel = {
  findAll: async (filters = {}) => {
    let sql = `
      SELECT i.*, k.nama_kategori, p.nama_penyedia, p.singkatan as penyedia_singkatan,
             CASE WHEN i.tanggal_tutup >= CURDATE() THEN 'active' ELSE 'closed' END as status
      FROM informasi_beasiswa i
      LEFT JOIN kategori_beasiswa k ON i.kategori_id = k.id
      LEFT JOIN penyedia_beasiswa p ON i.penyedia_id = p.id
    `;

    const whereClauses = [];
    const queryParams = [];

    if (filters.search) {
      whereClauses.push('(i.nama_beasiswa LIKE ? OR i.deskripsi LIKE ? OR p.nama_penyedia LIKE ? OR p.singkatan LIKE ?)');
      const searchVal = `%${filters.search}%`;
      queryParams.push(searchVal, searchVal, searchVal, searchVal);
    }

    if (filters.kategori_id) {
      whereClauses.push('i.kategori_id = ?');
      queryParams.push(parseInt(filters.kategori_id, 10));
    }

    if (filters.status) {
      if (filters.status === 'active') {
        whereClauses.push('i.tanggal_tutup >= CURDATE()');
      } else if (filters.status === 'closed') {
        whereClauses.push('i.tanggal_tutup < CURDATE()');
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const allowedSortFields = ['id', 'nama_beasiswa', 'tanggal_buka', 'tanggal_tutup', 'created_at'];
    const sort = allowedSortFields.includes(filters.sort) ? filters.sort : 'id';
    const order = filters.order === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY i.${sort} ${order}`;

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const offset = (page - 1) * limit;

    sql += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const [rows] = await pool.query(sql, queryParams);
    return rows;
  },

  count: async (filters = {}) => {
    let sql = `
      SELECT COUNT(*) as total
      FROM informasi_beasiswa i
      LEFT JOIN kategori_beasiswa k ON i.kategori_id = k.id
      LEFT JOIN penyedia_beasiswa p ON i.penyedia_id = p.id
    `;

    const whereClauses = [];
    const queryParams = [];

    if (filters.search) {
      whereClauses.push('(i.nama_beasiswa LIKE ? OR i.deskripsi LIKE ? OR p.nama_penyedia LIKE ? OR p.singkatan LIKE ?)');
      const searchVal = `%${filters.search}%`;
      queryParams.push(searchVal, searchVal, searchVal, searchVal);
    }

    if (filters.kategori_id) {
      whereClauses.push('i.kategori_id = ?');
      queryParams.push(parseInt(filters.kategori_id, 10));
    }

    if (filters.status) {
      if (filters.status === 'active') {
        whereClauses.push('i.tanggal_tutup >= CURDATE()');
      } else if (filters.status === 'closed') {
        whereClauses.push('i.tanggal_tutup < CURDATE()');
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const [rows] = await pool.query(sql, queryParams);
    return rows[0].total;
  },

  findById: async (id) => {
    const sql = `
      SELECT i.*, k.nama_kategori, p.nama_penyedia, p.singkatan as penyedia_singkatan,
             CASE WHEN i.tanggal_tutup >= CURDATE() THEN 'active' ELSE 'closed' END as status
      FROM informasi_beasiswa i
      LEFT JOIN kategori_beasiswa k ON i.kategori_id = k.id
      LEFT JOIN penyedia_beasiswa p ON i.penyedia_id = p.id
      WHERE i.id = ?
    `;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  create: async ({ nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id }) => {
    const [result] = await pool.query(
      `INSERT INTO informasi_beasiswa 
       (nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id]
    );
    return result.insertId;
  },

  update: async (id, { nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id }) => {
    const [result] = await pool.query(
      `UPDATE informasi_beasiswa 
       SET nama_beasiswa = ?, deskripsi = ?, gambar = ?, tanggal_buka = ?, tanggal_tutup = ?, url_pendaftaran = ?, kategori_id = ?, penyedia_id = ?
       WHERE id = ?`,
      [nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM informasi_beasiswa WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  countActive: async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM informasi_beasiswa WHERE tanggal_tutup >= CURDATE()');
    return rows[0].total;
  },
};

module.exports = scholarshipModel;
