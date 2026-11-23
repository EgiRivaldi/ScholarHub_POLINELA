const { pool } = require('../config/database');

const formatProviderRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    nama_penyelenggara: row.nama_penyelenggara,
    nama_penyedia: row.nama_penyelenggara, // legacy alias
    url_website: row.url_website,
    website: row.url_website, // legacy alias
    email_kontak: row.email_kontak,
    kontak: row.email_kontak, // legacy alias
    alamat: row.alamat,
    deskripsi: row.deskripsi,
    total_beasiswa: Number(row.total_beasiswa || 0),
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
    created_at: row.dibuat_pada,
    updated_at: row.diperbarui_pada,
  };
};

const Provider = {
  findAll: async () => {
    const query = `
      SELECT 
        p.id,
        p.nama_penyelenggara,
        p.url_website,
        p.email_kontak,
        p.alamat,
        p.deskripsi,
        p.dibuat_pada,
        p.diperbarui_pada,
        COUNT(b.id) AS total_beasiswa
      FROM penyelenggara_beasiswa p
      LEFT JOIN beasiswa b ON b.penyelenggara_id = p.id
      GROUP BY p.id
      ORDER BY p.id ASC
    `;
    const [rows] = await pool.query(query);
    return rows.map(formatProviderRow);
  },

  findById: async (id) => {
    const query = `
      SELECT 
        p.id,
        p.nama_penyelenggara,
        p.url_website,
        p.email_kontak,
        p.alamat,
        p.deskripsi,
        p.dibuat_pada,
        p.diperbarui_pada,
        COUNT(b.id) AS total_beasiswa
      FROM penyelenggara_beasiswa p
      LEFT JOIN beasiswa b ON b.penyelenggara_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows || rows.length === 0) return null;
    return formatProviderRow(rows[0]);
  },

  create: async (providerData) => {
    const nama_penyelenggara = providerData.nama_penyelenggara || providerData.nama_penyedia;
    const url_website = providerData.url_website || providerData.website || null;
    const email_kontak = providerData.email_kontak || providerData.kontak || null;
    const alamat = providerData.alamat || null;
    const deskripsi = providerData.deskripsi || null;

    const [result] = await pool.query(
      'INSERT INTO penyelenggara_beasiswa (nama_penyelenggara, url_website, email_kontak, alamat, deskripsi) VALUES (?, ?, ?, ?, ?)',
      [nama_penyelenggara, url_website, email_kontak, alamat, deskripsi]
    );
    return result.insertId;
  },

  update: async (id, providerData) => {
    const updates = [];
    const values = [];

    const nama_penyelenggara = providerData.nama_penyelenggara || providerData.nama_penyedia;
    if (nama_penyelenggara !== undefined) {
      updates.push('nama_penyelenggara = ?');
      values.push(nama_penyelenggara);
    }

    const url_website = providerData.url_website || providerData.website;
    if (url_website !== undefined) {
      updates.push('url_website = ?');
      values.push(url_website);
    }

    const email_kontak = providerData.email_kontak || providerData.kontak;
    if (email_kontak !== undefined) {
      updates.push('email_kontak = ?');
      values.push(email_kontak);
    }

    if (providerData.alamat !== undefined) {
      updates.push('alamat = ?');
      values.push(providerData.alamat);
    }

    if (providerData.deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(providerData.deskripsi);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE penyelenggara_beasiswa SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM penyelenggara_beasiswa WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Provider;
