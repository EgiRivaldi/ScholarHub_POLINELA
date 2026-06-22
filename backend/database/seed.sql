USE scholarhub_polinela;

-- 1. Insert Admin User
-- Password is 'password' hashed using bcrypt ($2b$10$yO0QO/O1.nQj0jV5pX8TluE5W3cTjK/jJ4hJgA2U2U.jV/o2Z6u0W)
INSERT INTO users (username, password_hash, email, full_name, role) VALUES 
('admin', '$2b$10$yO0QO/O1.nQj0jV5pX8TluE5W3cTjK/jJ4hJgA2U2U.jV/o2Z6u0W', 'admin@scholarhub.polinela.ac.id', 'Administrator Polinela', 'super_admin');

-- 2. Insert Categories
INSERT INTO categories (name, slug, description, icon_name) VALUES 
('Beasiswa Prestasi', 'beasiswa-prestasi', 'Beasiswa untuk mahasiswa dengan pencapaian akademik terbaik.', 'Trophy'),
('Bantuan Pendidikan', 'bantuan-pendidikan', 'Bantuan biaya pendidikan untuk mahasiswa kurang mampu.', 'Wallet'),
('Pertukaran Pelajar', 'pertukaran-pelajar', 'Program pertukaran pelajar ke luar negeri atau kampus lain.', 'Globe');

-- 3. Insert Providers
INSERT INTO providers (name, description, website_url) VALUES 
('Kementerian Pendidikan', 'Kementerian Pendidikan dan Kebudayaan Republik Indonesia', 'https://kemdikbud.go.id'),
('Bank Indonesia', 'Bank Sentral Republik Indonesia', 'https://www.bi.go.id'),
('Pemerintah Provinsi Lampung', 'Pemerintah daerah Provinsi Lampung', 'https://lampungprov.go.id');

-- 4. Insert Scholarships
INSERT INTO scholarships (title, slug, provider_id, category_id, description, coverage, registration_link, status, open_date, deadline_date) VALUES 
('Beasiswa KIP Kuliah 2026', 'beasiswa-kip-kuliah-2026', 1, 2, 'Program Bantuan Pendidikan bagi mahasiswa kurang mampu dengan potensi akademik.', 'Biaya Pendidikan & Biaya Hidup', 'https://kip-kuliah.kemdikbud.go.id', 'Open', '2026-06-01', '2026-08-31'),
('Beasiswa Bank Indonesia 2026', 'beasiswa-bank-indonesia-2026', 2, 1, 'Beasiswa bergengsi dari BI untuk mahasiswa berprestasi dan aktif berorganisasi.', 'Biaya Pendidikan Rp 1.000.000 / bulan', 'https://www.bi.go.id', 'Open', '2026-06-15', '2026-07-20'),
('Beasiswa Mahasiswa Lampung Berjaya', 'beasiswa-mahasiswa-lampung-berjaya', 3, 1, 'Dukungan pendidikan bagi mahasiswa ber-KTP Provinsi Lampung yang berkuliah di institusi negeri.', 'Bantuan Uang Tunai Rp 5.000.000 / semester', 'https://lampungprov.go.id', 'Upcoming', '2026-09-01', '2026-10-15');

-- 5. Insert Scholarship Requirements
-- For KIP Kuliah (scholarship_id = 1)
INSERT INTO scholarship_requirements (scholarship_id, requirement_text, is_mandatory) VALUES 
(1, 'Memiliki Kartu Indonesia Pintar (KIP) atau dari keluarga peserta PKH', TRUE),
(1, 'Lulusan SMA/SMK tahun berjalan atau maksimal 2 tahun sebelumnya', TRUE),
(1, 'Surat Keterangan Tidak Mampu (SKTM)', TRUE);

-- For Beasiswa BI (scholarship_id = 2)
INSERT INTO scholarship_requirements (scholarship_id, requirement_text, is_mandatory) VALUES 
(2, 'Minimal IPK 3.25 skala 4.00', TRUE),
(2, 'Mahasiswa aktif semester 4 atau 6', TRUE),
(2, 'Surat Rekomendasi dari Ketua Program Studi', TRUE),
(2, 'Aktif dalam organisasi kemahasiswaan (GenBI)', FALSE);

-- For Beasiswa Lampung (scholarship_id = 3)
INSERT INTO scholarship_requirements (scholarship_id, requirement_text, is_mandatory) VALUES 
(3, 'Kartu Tanda Penduduk (KTP) Provinsi Lampung', TRUE),
(3, 'Surat Keterangan Berkelakuan Baik dari Kampus', TRUE);
