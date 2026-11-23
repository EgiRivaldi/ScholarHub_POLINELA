const { pool } = require('../config/database');
const { slugify } = require('../utils/slugify');

// Helper to determine registration status from schedule dates
const getStatusPendaftaran = (tanggalBuka, tanggalTutup) => {
  const now = new Date();
  if (tanggalBuka) {
    const buka = new Date(tanggalBuka);
    if (buka > now) return 'belum_dibuka';
  }
  if (tanggalTutup) {
    const tutup = new Date(tanggalTutup);
    // End of day if only date is provided
    if (tutup < now) return 'ditutup';
  }
  return 'dibuka';
};

const formatScholarshipRow = (row) => {
  if (!row) return null;
  const statusPendaftaran = getStatusPendaftaran(row.tanggal_buka, row.tanggal_tutup);

  return {
    id: row.id,
    judul: row.judul,
    nama_beasiswa: row.judul, // legacy alias
    slug: row.slug,
    ringkasan: row.ringkasan,
    deskripsi: row.deskripsi,
    kategori_id: row.kategori_id,
    nama_kategori: row.nama_kategori,
    kategori_slug: row.kategori_slug,
    penyelenggara_id: row.penyelenggara_id,
    penyedia_id: row.penyelenggara_id, // legacy alias
    nama_penyelenggara: row.nama_penyelenggara,
    nama_penyedia: row.nama_penyelenggara, // legacy alias
    url_gambar: row.url_gambar,
    gambar: row.url_gambar, // legacy alias
    url_sumber_resmi: row.url_sumber_resmi,
    url_pendaftaran: row.url_pendaftaran,
    tanggal_buka: row.tanggal_buka,
    tanggal_tutup: row.tanggal_tutup,
    status_publikasi: row.status_publikasi || 'draf',
    status_pendaftaran: statusPendaftaran,
    status: statusPendaftaran === 'dibuka' ? 'active' : 'closed', // legacy alias
    dibuat_oleh: row.dibuat_oleh,
    pembuat_nama: row.pembuat_nama,
    diperbarui_oleh: row.diperbarui_oleh,
    pengubah_nama: row.pengubah_nama,
    diterbitkan_pada: row.diterbitkan_pada,
    diverifikasi_pada: row.diverifikasi_pada,
    dibuat_pada: row.dibuat_pada,
    diperbarui_pada: row.diperbarui_pada,
    created_at: row.dibuat_pada,
    updated_at: row.diperbarui_pada,
  };
};

const buildBaseQuery = () => `
  SELECT 
    b.id,
    b.dibuat_oleh,
    b.diperbarui_oleh,
    b.kategori_id,
    b.penyelenggara_id,
    b.judul,
    b.slug,
    b.ringkasan,
    b.deskripsi,
    b.url_gambar,
    b.url_sumber_resmi,
    b.url_pendaftaran,
    b.tanggal_buka,
    b.tanggal_tutup,
    b.status_publikasi,
    b.diterbitkan_pada,
    b.diverifikasi_pada,
    b.dibuat_pada,
    b.diperbarui_pada,
    k.nama_kategori,
    k.slug AS kategori_slug,
    p.nama_penyelenggara,
    p.url_website AS penyelenggara_website,
    u_buat.nama_lengkap AS pembuat_nama,
    u_ubah.nama_lengkap AS pengubah_nama
  FROM beasiswa b
  LEFT JOIN kategori_beasiswa k ON k.id = b.kategori_id
  LEFT JOIN penyelenggara_beasiswa p ON p.id = b.penyelenggara_id
  LEFT JOIN pengguna u_buat ON u_buat.id = b.dibuat_oleh
  LEFT JOIN pengguna u_ubah ON u_ubah.id = b.diperbarui_oleh
`;

const Scholarship = {
  findAll: async (filters = {}) => {
    let query = buildBaseQuery();
    const whereClauses = [];
    const params = [];

    // Search query on title, summary, or description
    if (filters.search) {
      whereClauses.push('(b.judul LIKE ? OR b.ringkasan LIKE ? OR b.deskripsi LIKE ?)');
      const pattern = `%${filters.search}%`;
      params.push(pattern, pattern, pattern);
    }

    // Category filter
    if (filters.kategori_id) {
      whereClauses.push('b.kategori_id = ?');
      params.push(filters.kategori_id);
    }

    // Provider filter
    if (filters.penyelenggara_id || filters.penyedia_id) {
      whereClauses.push('b.penyelenggara_id = ?');
      params.push(filters.penyelenggara_id || filters.penyedia_id);
    }

    // Publication status filter (e.g. 'terbit' for public, or 'draf', 'arsip')
    if (filters.status_publikasi) {
      whereClauses.push('b.status_publikasi = ?');
      params.push(filters.status_publikasi);
    }

    // Registration status / schedule filter
    if (filters.status_pendaftaran) {
      if (filters.status_pendaftaran === 'belum_dibuka') {
        whereClauses.push('b.tanggal_buka > NOW()');
      } else if (filters.status_pendaftaran === 'dibuka') {
        whereClauses.push('(b.tanggal_buka IS NULL OR b.tanggal_buka <= NOW()) AND (b.tanggal_tutup IS NULL OR b.tanggal_tutup >= NOW())');
      } else if (filters.status_pendaftaran === 'ditutup') {
        whereClauses.push('b.tanggal_tutup < NOW()');
      }
    } else if (filters.status) {
      // Legacy compatibility ('active' / 'closed')
      if (filters.status === 'active') {
        whereClauses.push('(b.tanggal_tutup IS NULL OR b.tanggal_tutup >= CURDATE())');
      } else if (filters.status === 'closed') {
        whereClauses.push('b.tanggal_tutup < CURDATE()');
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Sorting
    const sortMap = {
      id: 'b.id',
      judul: 'b.judul',
      nama_beasiswa: 'b.judul',
      tanggal_buka: 'b.tanggal_buka',
      tanggal_tutup: 'b.tanggal_tutup',
      created_at: 'b.dibuat_pada',
      dibuat_pada: 'b.dibuat_pada',
    };
    const sortField = sortMap[filters.sort] || 'b.id';
    const sortOrder = String(filters.order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    const page = Math.max(1, parseInt(filters.page, 10) || 1);
    const limit = Math.max(1, parseInt(filters.limit, 10) || 10);
    const offset = (page - 1) * limit;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows.map(formatScholarshipRow);
  },

  count: async (filters = {}) => {
    let query = 'SELECT COUNT(b.id) AS total FROM beasiswa b';
    const whereClauses = [];
    const params = [];

    if (filters.search) {
      whereClauses.push('(b.judul LIKE ? OR b.ringkasan LIKE ? OR b.deskripsi LIKE ?)');
      const pattern = `%${filters.search}%`;
      params.push(pattern, pattern, pattern);
    }

    if (filters.kategori_id) {
      whereClauses.push('b.kategori_id = ?');
      params.push(filters.kategori_id);
    }

    if (filters.penyelenggara_id || filters.penyedia_id) {
      whereClauses.push('b.penyelenggara_id = ?');
      params.push(filters.penyelenggara_id || filters.penyedia_id);
    }

    if (filters.status_publikasi) {
      whereClauses.push('b.status_publikasi = ?');
      params.push(filters.status_publikasi);
    }

    if (filters.status_pendaftaran) {
      if (filters.status_pendaftaran === 'belum_dibuka') {
        whereClauses.push('b.tanggal_buka > NOW()');
      } else if (filters.status_pendaftaran === 'dibuka') {
        whereClauses.push('(b.tanggal_buka IS NULL OR b.tanggal_buka <= NOW()) AND (b.tanggal_tutup IS NULL OR b.tanggal_tutup >= NOW())');
      } else if (filters.status_pendaftaran === 'ditutup') {
        whereClauses.push('b.tanggal_tutup < NOW()');
      }
    } else if (filters.status) {
      if (filters.status === 'active') {
        whereClauses.push('(b.tanggal_tutup IS NULL OR b.tanggal_tutup >= CURDATE())');
      } else if (filters.status === 'closed') {
        whereClauses.push('b.tanggal_tutup < CURDATE()');
      }
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const [rows] = await pool.query(query, params);
    return Number(rows[0]?.total || 0);
  },

  findById: async (id) => {
    const query = `${buildBaseQuery()} WHERE b.id = ? LIMIT 1`;
    const [rows] = await pool.query(query, [id]);
    if (!rows || rows.length === 0) return null;
    return formatScholarshipRow(rows[0]);
  },

  findBySlug: async (slug) => {
    const query = `${buildBaseQuery()} WHERE b.slug = ? LIMIT 1`;
    const [rows] = await pool.query(query, [slug]);
    if (!rows || rows.length === 0) return null;
    return formatScholarshipRow(rows[0]);
  },

  create: async (data) => {
    const judul = data.judul || data.nama_beasiswa;
    let baseSlug = data.slug || slugify(judul);
    let finalSlug = baseSlug;
    let counter = 1;
    while (true) {
      const [existing] = await pool.query('SELECT id FROM beasiswa WHERE slug = ? LIMIT 1', [finalSlug]);
      if (existing.length === 0) break;
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const kategori_id = data.kategori_id;
    const penyelenggara_id = data.penyelenggara_id || data.penyedia_id;
    const dibuat_oleh = data.dibuat_oleh || 1; // ID admin
    const ringkasan = data.ringkasan || null;
    const deskripsi = data.deskripsi || null;
    const url_gambar = data.url_gambar || data.gambar || null;
    const url_sumber_resmi = data.url_sumber_resmi || null;
    const url_pendaftaran = data.url_pendaftaran || null;
    const tanggal_buka = data.tanggal_buka || null;
    const tanggal_tutup = data.tanggal_tutup || null;
    const status_publikasi = data.status_publikasi || 'terbit'; // default 'terbit' or 'draf'
    const diterbitkan_pada = status_publikasi === 'terbit' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO beasiswa (
        dibuat_oleh, kategori_id, penyelenggara_id, judul, slug,
        ringkasan, deskripsi, url_gambar, url_sumber_resmi, url_pendaftaran,
        tanggal_buka, tanggal_tutup, status_publikasi, diterbitkan_pada
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dibuat_oleh, kategori_id, penyelenggara_id, judul, finalSlug,
        ringkasan, deskripsi, url_gambar, url_sumber_resmi, url_pendaftaran,
        tanggal_buka, tanggal_tutup, status_publikasi, diterbitkan_pada
      ]
    );

    return result.insertId;
  },

  update: async (id, data) => {
    const updates = [];
    const values = [];

    const judul = data.judul || data.nama_beasiswa;
    if (judul !== undefined) {
      updates.push('judul = ?');
      values.push(judul);

      if (!data.slug) {
        let baseSlug = slugify(judul);
        let finalSlug = baseSlug;
        let counter = 1;
        while (true) {
          const [existing] = await pool.query('SELECT id FROM beasiswa WHERE slug = ? AND id != ? LIMIT 1', [finalSlug, id]);
          if (existing.length === 0) break;
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        updates.push('slug = ?');
        values.push(finalSlug);
      }
    }

    if (data.slug !== undefined) {
      updates.push('slug = ?');
      values.push(data.slug);
    }

    if (data.kategori_id !== undefined) {
      updates.push('kategori_id = ?');
      values.push(data.kategori_id);
    }

    const penyelenggara_id = data.penyelenggara_id || data.penyedia_id;
    if (penyelenggara_id !== undefined) {
      updates.push('penyelenggara_id = ?');
      values.push(penyelenggara_id);
    }

    if (data.ringkasan !== undefined) {
      updates.push('ringkasan = ?');
      values.push(data.ringkasan);
    }

    if (data.deskripsi !== undefined) {
      updates.push('deskripsi = ?');
      values.push(data.deskripsi);
    }

    const url_gambar = data.url_gambar !== undefined ? data.url_gambar : data.gambar;
    if (url_gambar !== undefined) {
      updates.push('url_gambar = ?');
      values.push(url_gambar);
    }

    if (data.url_sumber_resmi !== undefined) {
      updates.push('url_sumber_resmi = ?');
      values.push(data.url_sumber_resmi);
    }

    if (data.url_pendaftaran !== undefined) {
      updates.push('url_pendaftaran = ?');
      values.push(data.url_pendaftaran);
    }

    if (data.tanggal_buka !== undefined) {
      updates.push('tanggal_buka = ?');
      values.push(data.tanggal_buka);
    }

    if (data.tanggal_tutup !== undefined) {
      updates.push('tanggal_tutup = ?');
      values.push(data.tanggal_tutup);
    }

    if (data.status_publikasi !== undefined) {
      updates.push('status_publikasi = ?');
      values.push(data.status_publikasi);
      if (data.status_publikasi === 'terbit') {
        updates.push('diterbitkan_pada = COALESCE(diterbitkan_pada, NOW())');
      }
    }

    if (data.diperbarui_oleh !== undefined) {
      updates.push('diperbarui_oleh = ?');
      values.push(data.diperbarui_oleh);
    }

    if (updates.length === 0) return 0;

    values.push(id);
    const [result] = await pool.query(
      `UPDATE beasiswa SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM beasiswa WHERE id = ?', [id]);
    return result.affectedRows;
  },

  countActive: async () => {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total FROM beasiswa WHERE status_publikasi = 'terbit' AND (tanggal_tutup IS NULL OR tanggal_tutup >= CURDATE())"
    );
    return Number(rows[0]?.total || 0);
  },
};

module.exports = Scholarship;
