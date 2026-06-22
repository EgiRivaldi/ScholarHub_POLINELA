const { pool } = require('../config/database');

const requirementModel = {
  findAll: async () => {
    const sql = `
      SELECT s.*, i.nama_beasiswa 
      FROM syarat_beasiswa s 
      LEFT JOIN informasi_beasiswa i ON s.beasiswa_id = i.id 
      ORDER BY s.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM syarat_beasiswa WHERE id = ?', [id]);
    return rows[0] || null;
  },

  findByScholarshipId: async (scholarshipId) => {
    const [rows] = await pool.query('SELECT * FROM syarat_beasiswa WHERE beasiswa_id = ?', [scholarshipId]);
    return rows[0] || null;
  },

  create: async ({ beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan }) => {
    const [result] = await pool.query(
      'INSERT INTO syarat_beasiswa (beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan) VALUES (?, ?, ?, ?)',
      [
        beasiswa_id,
        ipk_minimum !== undefined && ipk_minimum !== null && ipk_minimum !== '' ? parseFloat(ipk_minimum) : 0.00,
        semester_minimum !== undefined && semester_minimum !== null && semester_minimum !== '' ? parseInt(semester_minimum, 10) : 1,
        dokumen_persyaratan || null
      ]
    );
    return result.insertId;
  },

  update: async (id, { beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan }) => {
    const [result] = await pool.query(
      'UPDATE syarat_beasiswa SET beasiswa_id = ?, ipk_minimum = ?, semester_minimum = ?, dokumen_persyaratan = ? WHERE id = ?',
      [
        beasiswa_id,
        ipk_minimum !== undefined && ipk_minimum !== null && ipk_minimum !== '' ? parseFloat(ipk_minimum) : 0.00,
        semester_minimum !== undefined && semester_minimum !== null && semester_minimum !== '' ? parseInt(semester_minimum, 10) : 1,
        dokumen_persyaratan || null,
        id
      ]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM syarat_beasiswa WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = requirementModel;
