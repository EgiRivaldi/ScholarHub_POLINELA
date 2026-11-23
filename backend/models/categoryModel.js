const { pool } = require('../config/database');
const { slugify } = require('../utils/slugify');

const formatCategoryRow = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    nama_kategori: row.nama_kategori,
    slug: row.slug,
    deskripsi: row.deskripsi,
    total_beasiswa: Number(row.total_beasiswa || 0),
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
    // legacy alias
    created_at: row.dibuat_pada,
    updated_at: row.diperbarui_pada,
  };
};

const Category = {
  findAll: async () => {
    const query = `
      SELECT 
        k.id,
        k.nama_kategori,
        k.slug,
        k.deskripsi,
        k.dibuat_pada,
        k.diperbarui_pada,
        COUNT(b.id) AS total_beasiswa
      FROM kategori_beasiswa k
      LEFT JOIN beasiswa b ON b.kategori_id = k.id
      GROUP BY k.id
      ORDER BY k.id ASC
    `;
    const [rows] = await pool.query(query);
    return rows.map(formatCategoryRow);
  },

  findById: async (id) => {
    const query = `
      SELECT 
        k.id,
        k.nama_kategori,
        k.slug,
        k.deskripsi,
        k.dibuat_pada,
        k.diperbarui_pada,
        COUNT(b.id) AS total_beasiswa
      FROM kategori_beasiswa k
      LEFT JOIN beasiswa b ON b.kategori_id = k.id
      WHERE k.id = ?
      GROUP BY k.id
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [id]);
    if (!rows || rows.length === 0) return null;
    return formatCategoryRow(rows[0]);
  },

  findBySlug: async (slug) => {
    const query = `
      SELECT 
        k.id,
        k.nama_kategori,
        k.slug,
        k.deskripsi,
        k.dibuat_pada,
        k.diperbarui_pada,
        COUNT(b.id) AS total_beasiswa
      FROM kategori_beasiswa k
      LEFT JOIN beasiswa b ON b.kategori_id = k.id
      WHERE k.slug = ?
      GROUP BY k.id
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [slug]);
    if (!rows || rows.length === 0) return null;
    return formatCategoryRow(rows[0]);
  },

  create: async (categoryData) => {
    const nama_kategori = categoryData.nama_kategori;
    let slug = categoryData.slug || slugify(nama_kategori);
    const deskripsi = categoryData.deskripsi || null;

    // Ensure unique slug
    let finalSlug = slug;
    let counter = 1;
    while (true) {
      const [existing] = await pool.query('SELECT id FROM kategori_beasiswa WHERE slug = ? LIMIT 1', [finalSlug]);
      if (existing.length === 0) break;
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const [result] = await pool.query(
      'INSERT INTO kategori_beasiswa (nama_kategori, slug, deskripsi) VALUES (?, ?, ?)',
      [nama_kategori, finalSlug, deskripsi]
    );
    return result.insertId;
  },

  update: async (id, categoryData) => {
    const updates = [];
    const values = [];

    if (categoryData.nama_kategori !== undefined) {
      updates.push('nama_kategori = ?');
      values.push(categoryData.nama_kategori);

      if (!categoryData.slug) {
        let slug = slugify(categoryData.nama_kategori);
        let finalSlug = slug;
        let counter = 1;
        while (true) {
          const [existing] = await pool.query('SELECT id FROM kategori_beasiswa WHERE slug = ? AND id != ? LIMIT 1', [finalSlug, id]);
          if (existing.length === 0) break;
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        updates.push('slug = ?');
        values.push(finalSlug);
      }
    }

    if (categoryData.slug !== undefined) {
      updates.push('slug = ?');
      values.push(categoryData.slug);
    }

    if (categoryData.deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(categoryData.deskripsi);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE kategori_beasiswa SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM kategori_beasiswa WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Category;
