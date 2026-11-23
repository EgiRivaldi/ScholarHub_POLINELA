const { pool } = require('../config/database');

const parseSettingValue = (val, type) => {
  if (val === null || val === undefined) return null;
  if (type === 'boolean') {
    return val === '1' || val === 'true' || val === true || val === 1;
  }
  if (type === 'angka') {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }
  return val;
};

const formatSettingRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    kunci_pengaturan: row.kunci_pengaturan,
    kelompok_pengaturan: row.kelompok_pengaturan,
    nama_pengaturan: row.nama_pengaturan,
    nilai_pengaturan: row.nilai_pengaturan,
    nilai_parsed: parseSettingValue(row.nilai_pengaturan, row.jenis_nilai),
    jenis_nilai: row.jenis_nilai,
    tampil_publik: Boolean(row.tampil_publik),
    diperbarui_oleh: row.diperbarui_oleh,
    pengubah_nama: row.pengubah_nama,
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
  };
};

const Setting = {
  findAll: async () => {
    const query = `
      SELECT 
        s.*,
        u.nama_lengkap AS pengubah_nama
      FROM pengaturan_situs s
      LEFT JOIN pengguna u ON u.id = s.diperbarui_oleh
      ORDER BY s.kelompok_pengaturan ASC, s.id ASC
    `;
    const [rows] = await pool.query(query);
    return rows.map(formatSettingRow);
  },

  findPublic: async () => {
    const query = `
      SELECT 
        kunci_pengaturan,
        kelompok_pengaturan,
        nama_pengaturan,
        nilai_pengaturan,
        jenis_nilai
      FROM pengaturan_situs
      WHERE tampil_publik = 1
      ORDER BY kelompok_pengaturan ASC, id ASC
    `;
    const [rows] = await pool.query(query);
    const result = {};
    rows.forEach((r) => {
      result[r.kunci_pengaturan] = parseSettingValue(r.nilai_pengaturan, r.jenis_nilai);
    });
    return result;
  },

  findByKey: async (key) => {
    const [rows] = await pool.query(
      'SELECT * FROM pengaturan_situs WHERE kunci_pengaturan = ? LIMIT 1',
      [key]
    );
    if (!rows || rows.length === 0) return null;
    return formatSettingRow(rows[0]);
  },

  updateByKey: async (key, value, updatedBy = null) => {
    const stringVal = value !== null && value !== undefined ? String(value) : null;
    const [result] = await pool.query(
      'UPDATE pengaturan_situs SET nilai_pengaturan = ?, diperbarui_oleh = ? WHERE kunci_pengaturan = ?',
      [stringVal, updatedBy, key]
    );
    return result.affectedRows;
  },

  updateBulk: async (settingsObject, updatedBy = null) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      let updatedCount = 0;

      for (const [key, val] of Object.entries(settingsObject)) {
        const stringVal = val !== null && val !== undefined ? String(val) : null;
        const [res] = await connection.query(
          'UPDATE pengaturan_situs SET nilai_pengaturan = ?, diperbarui_oleh = ? WHERE kunci_pengaturan = ?',
          [stringVal, updatedBy, key]
        );
        updatedCount += res.affectedRows;
      }

      await connection.commit();
      return updatedCount;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = Setting;
