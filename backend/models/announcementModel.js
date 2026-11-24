const { pool } = require('../config/database');

const formatAnnouncementRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    judul: row.judul,
    isi_pengumuman: row.isi_pengumuman,
    url_tujuan: row.url_tujuan,
    aktif: Boolean(row.aktif),
    mulai_tayang: row.mulai_tayang,
    akhir_tayang: row.akhir_tayang,
    urutan_tampil: Number(row.urutan_tampil || 0),
    dibuat_oleh: row.dibuat_oleh,
    pembuat_nama: row.pembuat_nama,
    diperbarui_oleh: row.diperbarui_oleh,
    pengubah_nama: row.pengubah_nama,
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
  };
};

const Announcement = {
  findAll: async () => {
    const query = `
      SELECT 
        p.*,
        u_buat.nama_lengkap AS pembuat_nama,
        u_ubah.nama_lengkap AS pengubah_nama
      FROM pengumuman p
      LEFT JOIN pengguna u_buat ON u_buat.id = p.dibuat_oleh
      LEFT JOIN pengguna u_ubah ON u_ubah.id = p.diperbarui_oleh
      ORDER BY p.urutan_tampil ASC, p.id DESC
    `;
    const [rows] = await pool.query(query);
    return rows.map(formatAnnouncementRow);
  },

  findActivePublic: async () => {
    const query = `
      SELECT 
        p.id,
        p.judul,
        p.isi_pengumuman,
        p.url_tujuan,
        p.urutan_tampil,
        p.mulai_tayang,
        p.dibuat_pada,
        u_buat.nama_lengkap AS pembuat_nama
      FROM pengumuman p
      LEFT JOIN pengguna u_buat ON u_buat.id = p.dibuat_oleh
      WHERE p.aktif = 1
        AND (p.mulai_tayang IS NULL OR p.mulai_tayang <= NOW())
        AND (p.akhir_tayang IS NULL OR p.akhir_tayang >= NOW())
      ORDER BY p.urutan_tampil ASC, p.id DESC
    `;
    const [rows] = await pool.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = `
      SELECT 
        p.*,
        u_buat.nama_lengkap AS pembuat_nama,
        u_ubah.nama_lengkap AS pengubah_nama
      FROM pengumuman p
      LEFT JOIN pengguna u_buat ON u_buat.id = p.dibuat_oleh
      LEFT JOIN pengguna u_ubah ON u_ubah.id = p.diperbarui_oleh
      WHERE p.id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows || rows.length === 0) return null;
    return formatAnnouncementRow(rows[0]);
  },

  create: async (data) => {
    const judul = data.judul;
    const isi_pengumuman = data.isi_pengumuman;
    const url_tujuan = data.url_tujuan || null;
    const aktif = data.aktif !== undefined ? (data.aktif ? 1 : 0) : 1;
    const mulai_tayang = data.mulai_tayang || null;
    const akhir_tayang = data.akhir_tayang || null;
    const urutan_tampil = Number(data.urutan_tampil || 0);
    const dibuat_oleh = data.dibuat_oleh || 1;

    const [result] = await pool.query(
      `INSERT INTO pengumuman 
        (judul, isi_pengumuman, url_tujuan, aktif, mulai_tayang, akhir_tayang, urutan_tampil, dibuat_oleh)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [judul, isi_pengumuman, url_tujuan, aktif, mulai_tayang, akhir_tayang, urutan_tampil, dibuat_oleh]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const updates = [];
    const values = [];

    if (data.judul !== undefined) {
      updates.push('judul = ?');
      values.push(data.judul);
    }
    if (data.isi_pengumuman !== undefined) {
      updates.push('isi_pengumuman = ?');
      values.push(data.isi_pengumuman);
    }
    if (data.url_tujuan !== undefined) {
      updates.push('url_tujuan = ?');
      values.push(data.url_tujuan);
    }
    if (data.aktif !== undefined) {
      updates.push('aktif = ?');
      values.push(data.aktif ? 1 : 0);
    }
    if (data.mulai_tayang !== undefined) {
      updates.push('mulai_tayang = ?');
      values.push(data.mulai_tayang);
    }
    if (data.akhir_tayang !== undefined) {
      updates.push('akhir_tayang = ?');
      values.push(data.akhir_tayang);
    }
    if (data.urutan_tampil !== undefined) {
      updates.push('urutan_tampil = ?');
      values.push(Number(data.urutan_tampil));
    }
    if (data.diperbarui_oleh !== undefined) {
      updates.push('diperbarui_oleh = ?');
      values.push(data.diperbarui_oleh);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE pengumuman SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM pengumuman WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Announcement;
