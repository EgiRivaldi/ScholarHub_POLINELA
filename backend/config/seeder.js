require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool, testConnection } = require('./database');
const { slugify } = require('../utils/slugify');
const logger = require('../utils/logger');

const seed = async () => {
  logger.info('Starting MySQL database seeder for beasiswa_polinela...');

  const connected = await testConnection();
  if (!connected) {
    logger.error('Cannot seed: database connection failed.');
    process.exit(1);
  }

  try {
    // 1. Seed pengguna (Single unified admin account)
    const hashAdmin = await bcrypt.hash('admin123', 10);

    await pool.query(
      `INSERT INTO pengguna (id, nama_pengguna, hash_kata_sandi, nama_lengkap, peran, aktif)
       VALUES 
       (1, 'admin', ?, 'Administrator Sistem Informasi Beasiswa POLINELA', 'admin_utama', 1)
       ON DUPLICATE KEY UPDATE 
         nama_pengguna = VALUES(nama_pengguna),
         hash_kata_sandi = VALUES(hash_kata_sandi),
         nama_lengkap = VALUES(nama_lengkap),
         peran = VALUES(peran),
         aktif = VALUES(aktif)`,
      [hashAdmin]
    );
    await pool.query(`DELETE FROM pengguna WHERE id > 1 AND nama_pengguna IN ('admin', 'admin_utama')`);
    logger.info('Single admin user seeded (admin / admin123)');

    // 2. Seed kategori_beasiswa
    const categories = [
      ['Pemerintah', 'Beasiswa yang diselenggarakan oleh instansi pemerintah pusat maupun daerah.'],
      ['Swasta & Yayasan', 'Beasiswa dari perusahaan, korporasi, dan yayasan swasta.'],
      ['Internal POLINELA', 'Program beasiswa internal khusus bagi mahasiswa aktif Politeknik Negeri Lampung.'],
      ['Internasional', 'Program beasiswa dari lembaga global untuk pertukaran pelajar dan studi luar negeri.'],
      ['BUMN', 'Program beasiswa dari Badan Usaha Milik Negara untuk talenta berprestasi.']
    ];

    const categoryMap = {};
    for (let i = 0; i < categories.length; i++) {
      const [nama, deskripsi] = categories[i];
      const slug = slugify(nama);
      const [res] = await pool.query(
        `INSERT INTO kategori_beasiswa (nama_kategori, slug, deskripsi)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE deskripsi = VALUES(deskripsi)`,
        [nama, slug, deskripsi]
      );
      const [catRows] = await pool.query('SELECT id FROM kategori_beasiswa WHERE nama_kategori = ?', [nama]);
      categoryMap[nama] = catRows[0].id;
    }
    logger.info(`Categories seeded (${categories.length} categories)`);

    // 3. Seed penyelenggara_beasiswa
    const providers = [
      ['Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi', 'https://beasiswa.kemdikbud.go.id', 'beasiswa@kemdikbud.go.id', 'Jakarta Pusat', 'Instansi pemerintah penyelenggara beasiswa pendidikan tinggi'],
      ['Lembaga Pengelola Dana Pendidikan (LPDP)', 'https://lpdp.kemenkeu.go.id', 'cso.lpdp@kemenkeu.go.id', 'Jakarta Pusat', 'Lembaga pengelola dana abadi pendidikan di bawah Kementerian Keuangan'],
      ['Djarum Foundation', 'https://djarumbeasiswaplus.org', 'kontak@djarumbeasiswaplus.org', 'Kudus, Jawa Tengah', 'Penyelenggara program Djarum Beasiswa Plus'],
      ['Bank Indonesia', 'https://www.bi.go.id', 'bicara@bi.go.id', 'Jakarta', 'Bank Sentral Republik Indonesia'],
      ['Politeknik Negeri Lampung (POLINELA)', 'https://polinela.ac.id', 'humas@polinela.ac.id', 'Jl. Soekarno Hatta No.10, Rajabasa, Bandar Lampung', 'Perguruan Tinggi Vokasi Negeri terkemuka di Lampung']
    ];

    const providerMap = {};
    for (let i = 0; i < providers.length; i++) {
      const [nama, web, email, alamat, deskripsi] = providers[i];
      await pool.query(
        `INSERT INTO penyelenggara_beasiswa (nama_penyelenggara, url_website, email_kontak, alamat, deskripsi)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           url_website = VALUES(url_website),
           email_kontak = VALUES(email_kontak),
           alamat = VALUES(alamat),
           deskripsi = VALUES(deskripsi)`,
        [nama, web, email, alamat, deskripsi]
      );
      const [provRows] = await pool.query('SELECT id FROM penyelenggara_beasiswa WHERE nama_penyelenggara = ?', [nama]);
      providerMap[nama] = provRows[0].id;
    }
    logger.info(`Providers seeded (${providers.length} providers)`);

    // 4. Seed beasiswa
    const scholarships = [
      {
        judul: 'KIP Kuliah Merdeka POLINELA 2026',
        kategori: 'Pemerintah',
        penyelenggara: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
        ringkasan: 'Bantuan biaya pendidikan penuh dan uang saku bulanan bagi mahasiswa baru dan aktif dengan potensi akademik berprestasi.',
        deskripsi: 'Program KIP Kuliah Merdeka memberikan pembebasan biaya kuliah secara penuh serta subsidi biaya hidup bulanan untuk mendukung kelancaran studi mahasiswa vokasi di Politeknik Negeri Lampung.',
        url_gambar: '/uploads/kip_kuliah.jpg',
        url_sumber_resmi: 'https://kip-kuliah.kemdikbud.go.id',
        url_pendaftaran: 'https://kip-kuliah.kemdikbud.go.id/siswa/pendaftaran/masuk',
        tanggal_buka: '2026-02-01 00:00:00',
        tanggal_tutup: '2026-08-30 23:59:59',
        status_publikasi: 'terbit',
        requirements: [
          { nama: 'Mahasiswa aktif POLINELA jenjang D3 atau Sarjana Terapan (D4)', jenis: 'umum', wajib: 1, urutan: 1 },
          { nama: 'Memiliki Kartu Indonesia Pintar (KIP) atau terdaftar di DTKS Kemensos', jenis: 'administrasi', wajib: 1, urutan: 2 },
          { nama: 'Surat Keterangan Penghasilan orang tua gabungan maksimal Rp 4.000.000 / bulan atau SKTM', jenis: 'administrasi', wajib: 1, urutan: 3 },
          { nama: 'Mempertahankan IPK minimal 3.00 pada setiap semester', jenis: 'akademik', wajib: 1, urutan: 4 },
          { nama: 'Scan KTP, Kartu Keluarga, dan Kartu Tanda Mahasiswa (KTM)', jenis: 'administrasi', wajib: 1, urutan: 5 }
        ]
      },
      {
        judul: 'Djarum Beasiswa Plus Angkatan 2026/2027',
        kategori: 'Swasta & Yayasan',
        penyelenggara: 'Djarum Foundation',
        ringkasan: 'Program beasiswa prestasi berupa dana beasiswa bulanan selama satu tahun serta pelatihan intensif soft skills.',
        deskripsi: 'Beswan Djarum mendapatkan dana beasiswa Rp 1.000.000,- setiap bulan selama 1 tahun penuh, serta pelatihan soft skills berkelas dunia mencakup Character Building, Leadership Development, Nation Building, dan Writing Competition.',
        url_gambar: '/uploads/djarum_plus.jpg',
        url_sumber_resmi: 'https://djarumbeasiswaplus.org',
        url_pendaftaran: 'https://djarumbeasiswaplus.org/pendaftaran',
        tanggal_buka: '2026-03-15 00:00:00',
        tanggal_tutup: '2026-05-30 23:59:59',
        status_publikasi: 'terbit',
        requirements: [
          { nama: 'Sedang menempuh pendidikan Sarjana Terapan (D4) semester IV pada saat pendaftaran', jenis: 'umum', wajib: 1, urutan: 1 },
          { nama: 'IPK minimum 3.20 pada semester III', jenis: 'akademik', wajib: 1, urutan: 2 },
          { nama: 'Aktif mengikuti kegiatan organisasi baik di dalam maupun di luar kampus', jenis: 'umum', wajib: 0, urutan: 3 },
          { nama: 'Tidak sedang menerima beasiswa dari pihak lain', jenis: 'umum', wajib: 1, urutan: 4 },
          { nama: 'Scan transkrip nilai resmi yang dilegalisir fakultas/jurusan', jenis: 'administrasi', wajib: 1, urutan: 5 }
        ]
      },
      {
        judul: 'Beasiswa Bank Indonesia (Komunitas GenBI) 2026',
        kategori: 'Pemerintah',
        penyelenggara: 'Bank Indonesia',
        ringkasan: 'Beasiswa pembinaan dan pengembangan kapasitas kepemimpinan bagi mahasiswa vokasi berprestasi di POLINELA.',
        deskripsi: 'Bank Indonesia memberikan tunjangan beasiswa berkala dan wadah pengembangan komunitas Generasi Baru Indonesia (GenBI) untuk melatih kepemimpinan, wawasan kebanksentralan, serta pengabdian masyarakat.',
        url_gambar: '/uploads/beasiswa_bi.jpg',
        url_sumber_resmi: 'https://www.bi.go.id/id/institute/beasiswa/',
        url_pendaftaran: 'https://bak.polinela.ac.id/beasiswa-bi',
        tanggal_buka: '2026-02-15 00:00:00',
        tanggal_tutup: '2026-04-15 23:59:59',
        status_publikasi: 'terbit',
        requirements: [
          { nama: 'Mahasiswa aktif POLINELA minimal semester 3 dan maksimal semester 6', jenis: 'umum', wajib: 1, urutan: 1 },
          { nama: 'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.25 skala 4.00', jenis: 'akademik', wajib: 1, urutan: 2 },
          { nama: 'Membuat resume pribadi (CV) dan Motivation Letter berbahasa Indonesia', jenis: 'administrasi', wajib: 1, urutan: 3 },
          { nama: 'Surat rekomendasi dari Jurusan / Wakil Direktur III Bidang Kemahasiswaan', jenis: 'administrasi', wajib: 1, urutan: 4 },
          { nama: 'Berusia maksimal 23 tahun pada saat mendaftar', jenis: 'umum', wajib: 1, urutan: 5 }
        ]
      },
      {
        judul: 'Beasiswa Prestasi Akademik Internal POLINELA 2026',
        kategori: 'Internal POLINELA',
        penyelenggara: 'Politeknik Negeri Lampung (POLINELA)',
        ringkasan: 'Penghargaan dan pembebasan biaya UKT bagi mahasiswa berprestasi peringkat terbaik di setiap program studi.',
        deskripsi: 'Program beasiswa internal Politeknik Negeri Lampung yang diberikan kepada mahasiswa berprestasi unggul secara konsisten dalam bidang akademik maupun kejuaraan kompetisi vokasi tingkat nasional.',
        url_gambar: '/uploads/prestasi_polinela.jpg',
        url_sumber_resmi: 'https://polinela.ac.id',
        url_pendaftaran: 'https://bak.polinela.ac.id/prestasi',
        tanggal_buka: '2026-08-01 00:00:00',
        tanggal_tutup: '2026-09-30 23:59:59',
        status_publikasi: 'terbit',
        requirements: [
          { nama: 'Mahasiswa aktif POLINELA semester 2 hingga semester 7', jenis: 'umum', wajib: 1, urutan: 1 },
          { nama: 'IPK minimal 3.50 tanpa nilai mata kuliah di bawah B', jenis: 'akademik', wajib: 1, urutan: 2 },
          { nama: 'Melampirkan sertifikat kejuaraan/penghargaan akademik minimal tingkat kota/provinsi', jenis: 'akademik', wajib: 0, urutan: 3 },
          { nama: 'Surat keterangan berkelakuan baik dan tidak pernah melanggar tata tertib kampus', jenis: 'administrasi', wajib: 1, urutan: 4 }
        ]
      }
    ];

    for (const item of scholarships) {
      const slug = slugify(item.judul);
      const catId = categoryMap[item.kategori];
      const provId = providerMap[item.penyelenggara];

      // Check if already exists
      const [existing] = await pool.query('SELECT id FROM beasiswa WHERE slug = ? LIMIT 1', [slug]);
      let beasiswaId;

      if (existing.length > 0) {
        beasiswaId = existing[0].id;
        await pool.query(
          `UPDATE beasiswa SET 
            kategori_id = ?, penyelenggara_id = ?, judul = ?, ringkasan = ?, deskripsi = ?,
            url_sumber_resmi = ?, url_pendaftaran = ?, tanggal_buka = ?, tanggal_tutup = ?,
            status_publikasi = ?, diterbitkan_pada = NOW()
           WHERE id = ?`,
          [
            catId, provId, item.judul, item.ringkasan, item.deskripsi,
            item.url_sumber_resmi, item.url_pendaftaran, item.tanggal_buka, item.tanggal_tutup,
            item.status_publikasi, beasiswaId
          ]
        );
      } else {
        const [res] = await pool.query(
          `INSERT INTO beasiswa (
            dibuat_oleh, kategori_id, penyelenggara_id, judul, slug, ringkasan, deskripsi,
            url_sumber_resmi, url_pendaftaran, tanggal_buka, tanggal_tutup, status_publikasi, diterbitkan_pada
          ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            catId, provId, item.judul, slug, item.ringkasan, item.deskripsi,
            item.url_sumber_resmi, item.url_pendaftaran, item.tanggal_buka, item.tanggal_tutup, item.status_publikasi
          ]
        );
        beasiswaId = res.insertId;
      }

      // Seed multi-line requirements
      await pool.query('DELETE FROM persyaratan_beasiswa WHERE beasiswa_id = ?', [beasiswaId]);
      for (const req of item.requirements) {
        await pool.query(
          `INSERT INTO persyaratan_beasiswa (beasiswa_id, nama_persyaratan, jenis_persyaratan, wajib, urutan_tampil)
           VALUES (?, ?, ?, ?, ?)`,
          [beasiswaId, req.nama, req.jenis, req.wajib, req.urutan]
        );
      }
    }
    logger.info(`Scholarships & Requirements seeded (${scholarships.length} programs)`);

    // 5. Seed pengumuman
    const announcements = [
      ['Pembaruan Jadwal Pendaftaran Beasiswa 2026', 'Pendaftaran program Beasiswa Bank Indonesia dan KIP Kuliah 2026 kini telah resmi dibuka. Silakan cek detail persyaratan lengkap.', 'https://polinela.ac.id/beasiswa', 1, 1],
      ['Sosialisasi Beasiswa Djarum Plus di Gedung Serba Guna POLINELA', 'Jangan lewatkan sesi informasi langsung bersama tim Djarum Foundation pada tanggal 10 April 2026.', null, 1, 2]
    ];

    for (const [judul, isi, url, aktif, urutan] of announcements) {
      await pool.query(
        `INSERT INTO pengumuman (judul, isi_pengumuman, url_tujuan, aktif, urutan_tampil, dibuat_oleh)
         VALUES (?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE isi_pengumuman = VALUES(isi_pengumuman)`,
        [judul, isi, url, aktif, urutan]
      );
    }
    logger.info(`Announcements seeded (${announcements.length} announcements)`);

    logger.info('MySQL Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

seed();
