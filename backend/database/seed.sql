-- Seed Kategori Beasiswa
INSERT INTO kategori_beasiswa (nama_kategori, deskripsi) VALUES
('Pemerintah', 'Beasiswa yang diselenggarakan oleh instansi pemerintah (pusat/daerah).'),
('Swasta', 'Beasiswa dari perusahaan atau yayasan swasta.'),
('Internasional', 'Beasiswa untuk studi atau program di luar negeri.'),
('BUMN', 'Beasiswa dari Badan Usaha Milik Negara.'),
('Universitas', 'Beasiswa internal dari perguruan tinggi.')
ON CONFLICT (nama_kategori) DO NOTHING;

-- Seed Penyedia Beasiswa
INSERT INTO penyedia_beasiswa (nama_penyedia, singkatan, website, logo) VALUES
('Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi', 'Kemdikbudristek', 'https://beasiswa.kemdikbud.go.id', 'kemdikbud_logo.png'),
('Lembaga Pengelola Dana Pendidikan', 'LPDP', 'https://lpdp.kemenkeu.go.id', 'lpdp_logo.png'),
('Djarum Foundation', 'Djarum', 'https://djarumbeasiswaplus.org', 'djarum_logo.png'),
('Bank Indonesia', 'BI', 'https://www.bi.go.id', 'bi_logo.png'),
('Politeknik Negeri Lampung', 'POLINELA', 'https://polinela.ac.id', 'polinela_logo.png')
ON CONFLICT (nama_penyedia) DO NOTHING;

-- Seed Informasi Beasiswa
INSERT INTO informasi_beasiswa (nama_beasiswa, deskripsi, gambar, tanggal_buka, tanggal_tutup, url_pendaftaran, kategori_id, penyedia_id) VALUES
('KIP Kuliah Merdeka', 'Bantuan biaya pendidikan bagi lulusan SMA/sederajat yang memiliki potensi akademik baik namun memiliki keterbatasan ekonomi.', 'kip_kuliah.jpg', '2024-02-01', '2025-05-30', 'https://kip-kuliah.kemdikbud.go.id', 1, 1),
('Beasiswa Reguler LPDP', 'Beasiswa pascasarjana untuk Warga Negara Indonesia yang ingin melanjutkan studi S2/S3.', 'lpdp_reguler.jpg', '2024-01-11', '2024-02-12', 'https://beasiswalpdp.kemenkeu.go.id', 1, 2),
('Djarum Beasiswa Plus', 'Program beasiswa berprestasi yang memberikan dana beasiswa dan berbagai macam pelatihan soft skills.', 'djarum_plus.jpg', '2024-03-27', '2025-05-30', 'https://djarumbeasiswaplus.org/pendaftaran', 2, 3),
('Beasiswa Bank Indonesia', 'Beasiswa yang ditujukan untuk mahasiswa program sarjana (S1) dan vokasi (D3/D4).', 'beasiswa_bi.jpg', '2024-02-15', '2024-03-15', 'https://www.bi.go.id/id/institute/beasiswa/', 4, 4),
('Beasiswa Prestasi POLINELA', 'Beasiswa internal untuk mahasiswa berprestasi Politeknik Negeri Lampung.', 'prestasi_polinela.jpg', '2024-08-01', '2025-08-31', 'https://bak.polinela.ac.id', 5, 5)
ON CONFLICT (nama_beasiswa) DO NOTHING;

-- Seed Syarat Beasiswa
INSERT INTO syarat_beasiswa (beasiswa_id, ipk_minimum, semester_minimum, dokumen_persyaratan) VALUES
(1, 0.00, 1, 'Kartu KIP/KKS, SKTM, KK, KTP, Rapor semester 1-6'),
(2, 3.00, 1, 'Ijazah S1/S2, Transkrip nilai, Sertifikat TOEFL/IELTS, LoA Unconditional, Surat Rekomendasi'),
(3, 3.20, 4, 'Transkrip nilai (min smt 3), KTP, KTM, Pas foto, Surat Keterangan Aktif Kuliah'),
(4, 3.25, 3, 'Transkrip nilai, KTP, KTM, Pas foto, Surat Keterangan Aktif Kuliah, Motivation Letter'),
(5, 3.50, 2, 'Transkrip nilai, Piagam/sertifikat penghargaan, KTM, KTP, Surat Rekomendasi')
ON CONFLICT (beasiswa_id) DO NOTHING;
