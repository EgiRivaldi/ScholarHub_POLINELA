const { pool } = require('../config/database');

const formatRequirementRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    beasiswa_id: row.beasiswa_id,
    judul_beasiswa: row.judul_beasiswa || row.judul,
    nama_persyaratan: row.nama_persyaratan,
    jenis_persyaratan: row.jenis_persyaratan || 'umum',
    wajib: Boolean(row.wajib),
    urutan_tampil: Number(row.urutan_tampil || 0),
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
    created_at: row.dibuat_pada,
    updated_at: row.diperbarui_pada,
  };
};

const Requirement = {
  findAll: async () => {
    const query = `
      SELECT 
        p.id,
        p.beasiswa_id,
        p.nama_persyaratan,
        p.jenis_persyaratan,
        p.wajib,
        p.urutan_tampil,
        p.dibuat_pada,
        p.diperbarui_pada,
        b.judul AS judul_beasiswa
      FROM persyaratan_beasiswa p
      LEFT JOIN beasiswa b ON b.id = p.beasiswa_id
      ORDER BY p.beasiswa_id ASC, p.urutan_tampil ASC, p.id ASC
    `;
    const [rows] = await pool.query(query);
    return rows.map(formatRequirementRow);
  },

  findByScholarshipId: async (beasiswa_id) => {
    const query = `
      SELECT 
        p.id,
        p.beasiswa_id,
        p.nama_persyaratan,
        p.jenis_persyaratan,
        p.wajib,
        p.urutan_tampil,
        p.dibuat_pada,
        p.diperbarui_pada,
        b.judul AS judul_beasiswa
      FROM persyaratan_beasiswa p
      LEFT JOIN beasiswa b ON b.id = p.beasiswa_id
      WHERE p.beasiswa_id = ?
      ORDER BY p.urutan_tampil ASC, p.id ASC
    `;
    const [rows] = await pool.query(query, [beasiswa_id]);
    return rows.map(formatRequirementRow);
  },

  findById: async (id) => {
    const query = `
      SELECT 
        p.id,
        p.beasiswa_id,
        p.nama_persyaratan,
        p.jenis_persyaratan,
        p.wajib,
        p.urutan_tampil,
        p.dibuat_pada,
        p.diperbarui_pada,
        b.judul AS judul_beasiswa
      FROM persyaratan_beasiswa p
      LEFT JOIN beasiswa b ON b.id = p.beasiswa_id
      WHERE p.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows || rows.length === 0) return null;
    return formatRequirementRow(rows[0]);
  },

  create: async (data) => {
    const beasiswa_id = data.beasiswa_id;
    const nama_persyaratan = data.nama_persyaratan;
    const jenis_persyaratan = data.jenis_persyaratan || 'umum';
    const wajib = data.wajib !== undefined ? (data.wajib ? 1 : 0) : 1;
    const urutan_tampil = Number(data.urutan_tampil || 0);

    const [result] = await pool.query(
      `INSERT INTO persyaratan_beasiswa 
        (beasiswa_id, nama_persyaratan, jenis_persyaratan, wajib, urutan_tampil)
       VALUES (?, ?, ?, ?, ?)`,
      [beasiswa_id, nama_persyaratan, jenis_persyaratan, wajib, urutan_tampil]
    );
    return result.insertId;
  },

  createBulk: async (beasiswa_id, requirements) => {
    if (!requirements || requirements.length === 0) return [];
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const insertedIds = [];

      for (let i = 0; i < requirements.length; i++) {
        const item = requirements[i];
        const nama_persyaratan = typeof item === 'string' ? item : item.nama_persyaratan;
        const jenis_persyaratan = item.jenis_persyaratan || 'umum';
        const wajib = item.wajib !== undefined ? (item.wajib ? 1 : 0) : 1;
        const urutan_tampil = item.urutan_tampil !== undefined ? item.urutan_tampil : i;

        const [res] = await connection.query(
          `INSERT INTO persyaratan_beasiswa 
            (beasiswa_id, nama_persyaratan, jenis_persyaratan, wajib, urutan_tampil)
           VALUES (?, ?, ?, ?, ?)`,
          [beasiswa_id, nama_persyaratan, jenis_persyaratan, wajib, urutan_tampil]
        );
        insertedIds.push(res.insertId);
      }

      await connection.commit();
      return insertedIds;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  update: async (id, data) => {
    const updates = [];
    const values = [];

    if (data.nama_persyaratan !== undefined) {
      updates.push('nama_persyaratan = ?');
      values.push(data.nama_persyaratan);
    }
    if (data.jenis_persyaratan !== undefined) {
      updates.push('jenis_persyaratan = ?');
      values.push(data.jenis_persyaratan);
    }
    if (data.wajib !== undefined) {
      updates.push('wajib = ?');
      values.push(data.wajib ? 1 : 0);
    }
    if (data.urutan_tampil !== undefined) {
      updates.push('urutan_tampil = ?');
      values.push(Number(data.urutan_tampil));
    }
    if (data.beasiswa_id !== undefined) {
      updates.push('beasiswa_id = ?');
      values.push(data.beasiswa_id);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE persyaratan_beasiswa SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM persyaratan_beasiswa WHERE id = ?', [id]);
    return result.affectedRows;
  },

  deleteByScholarshipId: async (beasiswa_id) => {
    const [result] = await pool.query('DELETE FROM persyaratan_beasiswa WHERE beasiswa_id = ?', [beasiswa_id]);
    return result.affectedRows;
  },
};

module.exports = Requirement;
