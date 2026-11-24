const app = require('./app');
const { pool, testConnection } = require('./config/database');
const bcrypt = require('bcrypt');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const ensureSingleAdmin = async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    // Ensure single primary admin account 'admin' has full 'admin_utama' privileges
    await pool.query(`DELETE FROM pengguna WHERE id > 1 AND nama_pengguna IN ('admin', 'admin_utama')`);
    await pool.query(
      `INSERT INTO pengguna (id, nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif)
       VALUES (1, 'admin', ?, 'Administrator Sistem Informasi Beasiswa POLINELA', 'admin_utama', 1)
       ON DUPLICATE KEY UPDATE
         nama_pengguna = 'admin',
         hash_kata_sandi = VALUES(hash_kata_sandi),
         nama_lengkap = VALUES(nama_lengkap),
         peran = 'admin_utama',
         aktif = 1`,
      [hash]
    );
    await pool.query(
      `UPDATE pengaturan_situs SET nilai_pengaturan = REPLACE(nilai_pengaturan, 'ScholarHub', 'Sistem Informasi Beasiswa') WHERE nilai_pengaturan LIKE '%ScholarHub%'`
    );
    // Ensure sample scholarships have active/upcoming closing dates so Dashboard & Homepage show live active programs
    await pool.query(
      `UPDATE beasiswa SET tanggal_buka = '2026-10-01 00:00:00', tanggal_tutup = '2026-12-20 23:59:59' WHERE slug LIKE '%kip-kuliah%'`
    );
    await pool.query(
      `UPDATE beasiswa SET tanggal_buka = '2026-11-01 00:00:00', tanggal_tutup = '2026-12-05 23:59:59' WHERE slug LIKE '%djarum%'`
    );
    await pool.query(
      `UPDATE beasiswa SET tanggal_buka = '2026-11-10 00:00:00', tanggal_tutup = '2027-01-15 23:59:59' WHERE slug LIKE '%bank-indonesia%'`
    );
    logger.info('Unified single admin account & active scholarship dates verified');
  } catch (err) {
    logger.warn(`Could not auto-unify admin account: ${err.message}`);
  }
};

const startServer = async () => {
  logger.info('Initializing Sistem Informasi Beasiswa POLINELA backend...');

  // Test database connection before launching server
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('Database connection failed. Exiting process.');
    process.exit(1);
  }

  await ensureSingleAdmin();

  app.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`API base URL: http://localhost:${PORT}/api`);
  });
};

startServer();
