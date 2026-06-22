require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool, testConnection } = require('./database');
const logger = require('../utils/logger');

const seed = async () => {
  logger.info('Starting database seeder...');

  const connected = await testConnection();
  if (!connected) {
    logger.error('Cannot seed: database connection failed.');
    process.exit(1);
  }

  try {
    // Seed default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      `INSERT IGNORE INTO akun_admin (username, password, nama_lengkap) VALUES (?, ?, ?)`,
      ['admin', hashedPassword, 'Administrator']
    );
    logger.info('Default admin account seeded (username: admin, password: admin123)');

    // Seed categories
    const categories = [
      ['Pemerintah', 'Beasiswa yang diselenggarakan oleh pemerintah pusat maupun daerah.'],
      ['Swasta', 'Beasiswa dari perusahaan dan yayasan swasta.'],
      ['Internal', 'Beasiswa internal dari Politeknik Negeri Lampung.'],
      ['Internasional', 'Beasiswa dari lembaga internasional.'],
    ];
    for (const [nama, deskripsi] of categories) {
      await pool.query(
        `INSERT IGNORE INTO kategori_beasiswa (nama_kategori, deskripsi) VALUES (?, ?)`,
        [nama, deskripsi]
      );
    }
    logger.info('Categories seeded (4 categories)');

    // Seed providers
    const providers = [
      ['Kementerian Pendidikan dan Kebudayaan', 'Kemendikbud', 'https://www.kemdikbud.go.id'],
      ['Lembaga Pengelola Dana Pendidikan', 'LPDP', 'https://www.lpdp.kemenkeu.go.id'],
      ['Djarum Foundation', 'Djarum', 'https://www.djarumbeasiswaplus.org'],
      ['Politeknik Negeri Lampung', 'POLINELA', 'https://www.polinela.ac.id'],
      ['Bank Indonesia', 'BI', 'https://www.bi.go.id'],
      ['Japan International Cooperation Agency', 'JICA', 'https://www.jica.go.jp'],
    ];
    for (const [nama, singkatan, website] of providers) {
      await pool.query(
        `INSERT IGNORE INTO penyedia_beasiswa (nama_penyedia, singkatan, website) VALUES (?, ?, ?)`,
        [nama, singkatan, website]
      );
    }
    logger.info('Providers seeded (6 providers)');

    // Seed scholarships
    const scholarships = [
      ['Beasiswa Unggulan Kemendikbud', 'Beasiswa Unggulan adalah program beasiswa yang diselenggarakan oleh Kementerian Pendidikan dan Kebudayaan untuk mahasiswa berprestasi.', '2026-01-15', '2026-03-31', 'https://beasiswaunggulan.kemdikbud.go.id', 1, 1],
      ['Beasiswa LPDP', 'Beasiswa LPDP adalah beasiswa prestisius dari pemerintah Indonesia untuk pendidikan S2 dan S3.', '2026-02-01', '2026-04-30', 'https://beasiswalpdp.kemenkeu.go.id', 1, 2],
      ['Djarum Beasiswa Plus', 'Program Djarum Beasiswa Plus memberikan beasiswa kepada mahasiswa yang berprestasi akademik dan aktif berorganisasi.', '2026-03-01', '2026-05-15', 'https://www.djarumbeasiswaplus.org', 2, 3],
      ['Beasiswa PPA POLINELA', 'Beasiswa Peningkatan Prestasi Akademik internal Politeknik Negeri Lampung.', '2026-02-15', '2026-03-15', 'https://polinela.ac.id/beasiswa-ppa', 3, 4],
      ['Beasiswa Bank Indonesia', 'Bank Indonesia menyediakan beasiswa untuk mahasiswa berprestasi di seluruh Indonesia.', '2026-04-01', '2026-06-30', 'https://www.bi.go.id/beasiswa', 2, 5],
      ['JICA Scholarship Program', 'Program beasiswa dari JICA untuk mahasiswa Indonesia yang ingin studi di Jepang.', '2026-05-01', '2026-07-31', 'https://www.jica.go.jp/scholarship', 4, 6],
    ];
    for (const [nama, deskripsi, buka, tutup, url, kat, peny] of scholarships) {
      await pool.query(
        `INSERT IGNORE INTO informasi_beasiswa (nama_beasiswa, deskripsi, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [nama, deskripsi, buka, tutup, url, kat, peny]
      );
    }
    logger.info('Scholarships seeded (6 scholarships)');

    // Seed requirements
    const requirements = [
      [1, 3.25, 3, 'KTP, KTM, Transkrip Nilai, Surat Rekomendasi Dosen, Sertifikat Prestasi, Essay Motivasi'],
      [2, 3.00, 7, 'KTP, Ijazah, Transkrip Nilai, TOEFL/IELTS, Surat Rekomendasi, Rencana Studi'],
      [3, 3.20, 4, 'KTP, KTM, Transkrip Nilai, Surat Rekomendasi, Foto, CV, Sertifikat Organisasi'],
      [4, 3.00, 2, 'KTP, KTM, Transkrip Nilai, Surat Keterangan Tidak Mampu, KK, Slip Gaji Orang Tua'],
      [5, 3.00, 3, 'KTP, KTM, Transkrip Nilai, Proposal Kegiatan, Surat Rekomendasi'],
      [6, 3.30, 5, 'KTP, Paspor, Transkrip Nilai, TOEFL/JLPT, Surat Rekomendasi, Research Plan'],
    ];
    for (const [beasiswaId, ipk, semester, dokumen] of requirements) {
      await pool.query(
        `INSERT IGNORE INTO syarat_beasiswa (beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan) VALUES (?, ?, ?, ?)`,
        [beasiswaId, ipk, semester, dokumen]
      );
    }
    logger.info('Requirements seeded (6 requirements)');

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
