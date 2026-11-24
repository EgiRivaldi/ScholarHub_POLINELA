-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 23 Nov 2026 pada 14.43
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `beasiswa_polinela`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `beasiswa`
--

CREATE TABLE `beasiswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `diperbarui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `kategori_id` bigint(20) UNSIGNED NOT NULL,
  `penyelenggara_id` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(300) NOT NULL,
  `ringkasan` varchar(500) DEFAULT NULL,
  `deskripsi` longtext DEFAULT NULL,
  `url_gambar` varchar(2048) DEFAULT NULL,
  `url_sumber_resmi` varchar(2048) DEFAULT NULL,
  `url_pendaftaran` varchar(2048) DEFAULT NULL,
  `tanggal_buka` datetime DEFAULT NULL,
  `tanggal_tutup` datetime DEFAULT NULL,
  `status_publikasi` enum('draf','terbit','arsip') NOT NULL DEFAULT 'draf',
  `diterbitkan_pada` datetime DEFAULT NULL,
  `diverifikasi_pada` datetime DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `beasiswa`
--

INSERT INTO `beasiswa` (`id`, `dibuat_oleh`, `diperbarui_oleh`, `kategori_id`, `penyelenggara_id`, `judul`, `slug`, `ringkasan`, `deskripsi`, `url_gambar`, `url_sumber_resmi`, `url_pendaftaran`, `tanggal_buka`, `tanggal_tutup`, `status_publikasi`, `diterbitkan_pada`, `diverifikasi_pada`, `dibuat_pada`, `diperbarui_pada`) VALUES
(2, 1, NULL, 2, 2, 'KIP Kuliah Merdeka POLINELA 2026', 'kip-kuliah-merdeka-polinela-2026', 'Bantuan biaya pendidikan penuh dan uang saku bulanan bagi mahasiswa baru dan aktif dengan potensi akademik berprestasi.', 'Program KIP Kuliah Merdeka memberikan pembebasan biaya kuliah secara penuh serta subsidi biaya hidup bulanan untuk mendukung kelancaran studi mahasiswa vokasi di Politeknik Negeri Lampung.', NULL, 'https://kip-kuliah.kemdikbud.go.id', 'https://kip-kuliah.kemdikbud.go.id/siswa/pendaftaran/masuk', '2026-02-01 00:00:00', '2026-08-30 23:59:59', 'terbit', '2026-11-22 20:22:04', NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(3, 1, NULL, 3, 4, 'Djarum Beasiswa Plus Angkatan 2026/2027', 'djarum-beasiswa-plus-angkatan-20262027', 'Program beasiswa prestasi berupa dana beasiswa bulanan selama satu tahun serta pelatihan intensif soft skills.', 'Beswan Djarum mendapatkan dana beasiswa Rp 1.000.000,- setiap bulan selama 1 tahun penuh, serta pelatihan soft skills berkelas dunia mencakup Character Building, Leadership Development, Nation Building, dan Writing Competition.', NULL, 'https://djarumbeasiswaplus.org', 'https://djarumbeasiswaplus.org/pendaftaran', '2026-03-15 00:00:00', '2026-05-30 23:59:59', 'terbit', '2026-11-22 20:22:04', NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(4, 1, NULL, 2, 5, 'Beasiswa Bank Indonesia (Komunitas GenBI) 2026', 'beasiswa-bank-indonesia-komunitas-genbi-2026', 'Beasiswa pembinaan dan pengembangan kapasitas kepemimpinan bagi mahasiswa vokasi berprestasi di POLINELA.', 'Bank Indonesia memberikan tunjangan beasiswa berkala dan wadah pengembangan komunitas Generasi Baru Indonesia (GenBI) untuk melatih kepemimpinan, wawasan kebanksentralan, serta pengabdian masyarakat.', NULL, 'https://www.bi.go.id/id/institute/beasiswa/', 'https://bak.polinela.ac.id/beasiswa-bi', '2026-02-15 00:00:00', '2026-04-15 23:59:59', 'terbit', '2026-11-22 20:22:04', NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(5, 1, NULL, 4, 6, 'Beasiswa Prestasi Akademik Internal POLINELA 2026', 'beasiswa-prestasi-akademik-internal-polinela-2026', 'Penghargaan dan pembebasan biaya UKT bagi mahasiswa berprestasi peringkat terbaik di setiap program studi.', 'Program beasiswa internal Politeknik Negeri Lampung yang diberikan kepada mahasiswa berprestasi unggul secara konsisten dalam bidang akademik maupun kejuaraan kompetisi vokasi tingkat nasional.', NULL, 'https://polinela.ac.id', 'https://bak.polinela.ac.id/prestasi', '2026-08-01 00:00:00', '2026-09-30 23:59:59', 'terbit', '2026-11-22 20:22:04', NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_beasiswa`
--

CREATE TABLE `kategori_beasiswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_kategori` varchar(120) NOT NULL,
  `slug` varchar(160) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `kategori_beasiswa`
--

INSERT INTO `kategori_beasiswa` (`id`, `nama_kategori`, `slug`, `deskripsi`, `dibuat_pada`, `diperbarui_pada`) VALUES
(2, 'Pemerintah', 'pemerintah', 'Beasiswa yang diselenggarakan oleh instansi pemerintah pusat maupun daerah.', '2026-11-22 20:22:03', '2026-11-22 20:22:03'),
(3, 'Swasta & Yayasan', 'swasta-yayasan', 'Beasiswa dari perusahaan, korporasi, dan yayasan swasta.', '2026-11-22 20:22:03', '2026-11-22 20:22:03'),
(4, 'Internal POLINELA', 'internal-polinela', 'Program beasiswa internal khusus bagi mahasiswa aktif Politeknik Negeri Lampung.', '2026-11-22 20:22:03', '2026-11-22 20:22:03'),
(5, 'Internasional', 'internasional', 'Program beasiswa dari lembaga global untuk pertukaran pelajar dan studi luar negeri.', '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(6, 'BUMN', 'bumn', 'Program beasiswa dari Badan Usaha Milik Negara untuk talenta berprestasi.', '2026-11-22 20:22:04', '2026-11-22 20:22:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_aktivitas`
--

CREATE TABLE `log_aktivitas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pengguna_id` bigint(20) UNSIGNED DEFAULT NULL,
  `aksi` enum('tambah','ubah','hapus','terbit','arsip','masuk') NOT NULL,
  `jenis_entitas` varchar(80) NOT NULL,
  `id_entitas` bigint(20) UNSIGNED DEFAULT NULL,
  `data_sebelum` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_sebelum`)),
  `data_sesudah` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data_sesudah`)),
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `log_aktivitas`
--

INSERT INTO `log_aktivitas` (`id`, `pengguna_id`, `aksi`, `jenis_entitas`, `id_entitas`, `data_sebelum`, `data_sesudah`, `dibuat_pada`) VALUES
(1, NULL, 'tambah', 'beasiswa', 1, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795353667791\"}', '2026-11-22 20:21:07'),
(2, NULL, 'tambah', 'beasiswa', 6, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795353800654\"}', '2026-11-22 20:23:20'),
(3, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 20:33:59'),
(4, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 20:33:59'),
(5, 1, 'tambah', 'pengguna', 4, NULL, '{\"nama_pengguna\":\"stg2_user_1795354439815\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-22 20:33:59'),
(6, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 20:35:11'),
(7, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 20:35:11'),
(8, 1, 'tambah', 'pengguna', 5, NULL, '{\"nama_pengguna\":\"stg2_user_1795354511913\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-22 20:35:12'),
(9, 1, 'ubah', 'pengguna', 5, '{\"nama_pengguna\":\"stg2_user_1795354511913\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795354511913\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-22 20:35:12'),
(10, 1, 'ubah', 'pengguna', 5, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-22 20:35:12'),
(11, 1, 'ubah', 'pengguna', 5, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-22 20:35:12'),
(12, 1, 'hapus', 'pengguna', 5, '{\"nama_pengguna\":\"stg2_user_1795354511913\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-22 20:35:12'),
(13, 1, 'tambah', 'pengguna', 6, NULL, '{\"nama_pengguna\":\"ref_admin_1795354512696\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-22 20:35:12'),
(14, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 20:35:39'),
(15, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 20:35:39'),
(16, 1, 'tambah', 'pengguna', 7, NULL, '{\"nama_pengguna\":\"stg2_user_1795354539643\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-22 20:35:39'),
(17, 1, 'ubah', 'pengguna', 7, '{\"nama_pengguna\":\"stg2_user_1795354539643\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795354539643\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-22 20:35:39'),
(18, 1, 'ubah', 'pengguna', 7, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-22 20:35:39'),
(19, 1, 'ubah', 'pengguna', 7, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-22 20:35:39'),
(20, 1, 'hapus', 'pengguna', 7, '{\"nama_pengguna\":\"stg2_user_1795354539643\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-22 20:35:40'),
(21, 1, 'tambah', 'pengguna', 8, NULL, '{\"nama_pengguna\":\"ref_admin_1795354540027\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-22 20:35:40'),
(22, 1, 'arsip', 'pengguna', 8, '{\"nama_pengguna\":\"ref_admin_1795354540027\",\"aktif\":true}', '{\"aktif\":false,\"alasan\":\"Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan\"}', '2026-11-22 20:35:40'),
(23, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 20:48:26'),
(24, 2, 'tambah', 'beasiswa', 9, NULL, '{\"judul\":\"Beasiswa Draf Uji 1795355306499\",\"status_publikasi\":\"draf\"}', '2026-11-22 20:48:26'),
(25, 2, 'tambah', 'beasiswa', 10, NULL, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795355306530\",\"status_publikasi\":\"terbit\"}', '2026-11-22 20:48:26'),
(26, 2, 'tambah', 'persyaratan_beasiswa', 10, NULL, '{\"beasiswa_id\":10,\"total_persyaratan\":5}', '2026-11-22 20:48:26'),
(27, 2, 'hapus', 'beasiswa', 9, '{\"judul\":\"Beasiswa Draf Uji 1795355306499\"}', NULL, '2026-11-22 20:48:26'),
(28, 2, 'hapus', 'beasiswa', 10, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795355306530\"}', NULL, '2026-11-22 20:48:26'),
(29, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:06:47'),
(30, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:06:49'),
(31, 2, 'tambah', 'pengumuman', 5, NULL, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '2026-11-22 21:06:50'),
(32, 2, 'ubah', 'pengumuman', 5, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true,\"urutan_tampil\":100}', '2026-11-22 21:06:50'),
(33, 2, 'hapus', 'pengumuman', 5, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true}', NULL, '2026-11-22 21:06:50'),
(34, 1, 'ubah', 'pengaturan_situs', NULL, NULL, '{\"teks_footer\":\"Politeknik Negeri Lampung\",\"durasi_pengumuman_detik\":\"20\"}', '2026-11-22 21:06:50'),
(35, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:08:33'),
(36, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:08:33'),
(37, 2, 'tambah', 'pengumuman', 6, NULL, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '2026-11-22 21:08:33'),
(38, 2, 'ubah', 'pengumuman', 6, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true,\"urutan_tampil\":100}', '2026-11-22 21:08:33'),
(39, 2, 'hapus', 'pengumuman', 6, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true}', NULL, '2026-11-22 21:08:33'),
(40, 1, 'ubah', 'pengaturan_situs', NULL, NULL, '{\"teks_footer\":\"Politeknik Negeri Lampung\",\"durasi_pengumuman_detik\":\"20\"}', '2026-11-22 21:08:33'),
(41, NULL, 'tambah', 'beasiswa', 11, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795356525208\"}', '2026-11-22 21:08:45'),
(42, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:08:46'),
(43, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:08:46'),
(44, 1, 'tambah', 'pengguna', 10, NULL, '{\"nama_pengguna\":\"stg2_user_1795356526336\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-22 21:08:46'),
(45, 1, 'ubah', 'pengguna', 10, '{\"nama_pengguna\":\"stg2_user_1795356526336\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795356526336\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-22 21:08:46'),
(46, 1, 'ubah', 'pengguna', 10, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-22 21:08:46'),
(47, 1, 'ubah', 'pengguna', 10, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-22 21:08:46'),
(48, 1, 'hapus', 'pengguna', 10, '{\"nama_pengguna\":\"stg2_user_1795356526336\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-22 21:08:46'),
(49, 1, 'tambah', 'pengguna', 11, NULL, '{\"nama_pengguna\":\"ref_admin_1795356526604\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-22 21:08:46'),
(50, 1, 'arsip', 'pengguna', 11, '{\"nama_pengguna\":\"ref_admin_1795356526604\",\"aktif\":true}', '{\"aktif\":false,\"alasan\":\"Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan\"}', '2026-11-22 21:08:46'),
(51, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:08:47'),
(52, 2, 'tambah', 'beasiswa', 13, NULL, '{\"judul\":\"Beasiswa Draf Uji 1795356527634\",\"status_publikasi\":\"draf\"}', '2026-11-22 21:08:47'),
(53, 2, 'tambah', 'beasiswa', 14, NULL, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795356527693\",\"status_publikasi\":\"terbit\"}', '2026-11-22 21:08:47'),
(54, 2, 'tambah', 'persyaratan_beasiswa', 14, NULL, '{\"beasiswa_id\":14,\"total_persyaratan\":5}', '2026-11-22 21:08:48'),
(55, 2, 'hapus', 'beasiswa', 13, '{\"judul\":\"Beasiswa Draf Uji 1795356527634\"}', NULL, '2026-11-22 21:08:48'),
(56, 2, 'hapus', 'beasiswa', 14, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795356527693\"}', NULL, '2026-11-22 21:08:48'),
(57, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:08:48'),
(58, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:08:48'),
(59, 2, 'tambah', 'pengumuman', 8, NULL, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '2026-11-22 21:08:48'),
(60, 2, 'ubah', 'pengumuman', 8, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true,\"urutan_tampil\":100}', '2026-11-22 21:08:48'),
(61, 2, 'hapus', 'pengumuman', 8, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true}', NULL, '2026-11-22 21:08:48'),
(62, 1, 'ubah', 'pengaturan_situs', NULL, NULL, '{\"teks_footer\":\"Politeknik Negeri Lampung\",\"durasi_pengumuman_detik\":\"20\"}', '2026-11-22 21:08:48'),
(63, NULL, 'tambah', 'beasiswa', 15, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795357318917\"}', '2026-11-22 21:21:58'),
(64, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:21:59'),
(65, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:22:00'),
(66, 1, 'tambah', 'pengguna', 13, NULL, '{\"nama_pengguna\":\"stg2_user_1795357320145\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-22 21:22:00'),
(67, 1, 'ubah', 'pengguna', 13, '{\"nama_pengguna\":\"stg2_user_1795357320145\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795357320145\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-22 21:22:00'),
(68, 1, 'ubah', 'pengguna', 13, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-22 21:22:00'),
(69, 1, 'ubah', 'pengguna', 13, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-22 21:22:00'),
(70, 1, 'hapus', 'pengguna', 13, '{\"nama_pengguna\":\"stg2_user_1795357320145\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-22 21:22:00'),
(71, 1, 'tambah', 'pengguna', 14, NULL, '{\"nama_pengguna\":\"ref_admin_1795357320394\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-22 21:22:00'),
(72, 1, 'arsip', 'pengguna', 14, '{\"nama_pengguna\":\"ref_admin_1795357320394\",\"aktif\":true}', '{\"aktif\":false,\"alasan\":\"Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan\"}', '2026-11-22 21:22:00'),
(73, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:22:01'),
(74, 2, 'tambah', 'beasiswa', 17, NULL, '{\"judul\":\"Beasiswa Draf Uji 1795357321451\",\"status_publikasi\":\"draf\"}', '2026-11-22 21:22:03'),
(75, 2, 'tambah', 'beasiswa', 18, NULL, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795357323877\",\"status_publikasi\":\"terbit\"}', '2026-11-22 21:22:03'),
(76, 2, 'tambah', 'persyaratan_beasiswa', 18, NULL, '{\"beasiswa_id\":18,\"total_persyaratan\":5}', '2026-11-22 21:22:03'),
(77, 2, 'hapus', 'beasiswa', 17, '{\"judul\":\"Beasiswa Draf Uji 1795357321451\"}', NULL, '2026-11-22 21:22:04'),
(78, 2, 'hapus', 'beasiswa', 18, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795357323877\"}', NULL, '2026-11-22 21:22:04'),
(79, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-22 21:22:04'),
(80, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-22 21:22:04'),
(81, 2, 'tambah', 'pengumuman', 10, NULL, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '2026-11-22 21:22:04'),
(82, 2, 'ubah', 'pengumuman', 10, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true,\"urutan_tampil\":100}', '2026-11-22 21:22:04'),
(83, 2, 'hapus', 'pengumuman', 10, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true}', NULL, '2026-11-22 21:22:04'),
(84, 1, 'ubah', 'pengaturan_situs', NULL, NULL, '{\"teks_footer\":\"Politeknik Negeri Lampung\",\"durasi_pengumuman_detik\":\"20\"}', '2026-11-22 21:22:04'),
(85, NULL, 'tambah', 'beasiswa', 19, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795387894617\"}', '2026-11-23 05:51:34'),
(86, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-23 05:51:35'),
(87, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 05:51:35'),
(88, 1, 'tambah', 'pengguna', 16, NULL, '{\"nama_pengguna\":\"stg2_user_1795387895970\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-23 05:51:36'),
(89, 1, 'ubah', 'pengguna', 16, '{\"nama_pengguna\":\"stg2_user_1795387895970\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795387895970\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-23 05:51:36'),
(90, 1, 'ubah', 'pengguna', 16, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-23 05:51:36'),
(91, 1, 'ubah', 'pengguna', 16, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-23 05:51:36'),
(92, 1, 'hapus', 'pengguna', 16, '{\"nama_pengguna\":\"stg2_user_1795387895970\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-23 05:51:36'),
(93, 1, 'tambah', 'pengguna', 17, NULL, '{\"nama_pengguna\":\"ref_admin_1795387896198\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-23 05:51:36'),
(94, 1, 'arsip', 'pengguna', 17, '{\"nama_pengguna\":\"ref_admin_1795387896198\",\"aktif\":true}', '{\"aktif\":false,\"alasan\":\"Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan\"}', '2026-11-23 05:51:36'),
(95, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 05:51:36'),
(96, 2, 'tambah', 'beasiswa', 21, NULL, '{\"judul\":\"Beasiswa Draf Uji 1795387897004\",\"status_publikasi\":\"draf\"}', '2026-11-23 05:51:37'),
(97, 2, 'tambah', 'beasiswa', 22, NULL, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795387897037\",\"status_publikasi\":\"terbit\"}', '2026-11-23 05:51:37'),
(98, 2, 'tambah', 'persyaratan_beasiswa', 22, NULL, '{\"beasiswa_id\":22,\"total_persyaratan\":5}', '2026-11-23 05:51:37'),
(99, 2, 'hapus', 'beasiswa', 21, '{\"judul\":\"Beasiswa Draf Uji 1795387897004\"}', NULL, '2026-11-23 05:51:37'),
(100, 2, 'hapus', 'beasiswa', 22, '{\"judul\":\"Beasiswa Terbit Lewat Deadline Uji 1795387897037\"}', NULL, '2026-11-23 05:51:37'),
(101, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-23 05:51:37'),
(102, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 05:51:37'),
(103, 2, 'tambah', 'pengumuman', 12, NULL, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '2026-11-23 05:51:37'),
(104, 2, 'ubah', 'pengumuman', 12, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4\",\"aktif\":true,\"urutan_tampil\":99}', '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true,\"urutan_tampil\":100}', '2026-11-23 05:51:37'),
(105, 2, 'hapus', 'pengumuman', 12, '{\"judul\":\"Pengumuman Uji Antigravity Tahap 4 (Diperbarui)\",\"aktif\":true}', NULL, '2026-11-23 05:51:37'),
(106, 1, 'ubah', 'pengaturan_situs', NULL, NULL, '{\"teks_footer\":\"Politeknik Negeri Lampung\",\"durasi_pengumuman_detik\":\"20\"}', '2026-11-23 05:51:37'),
(107, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 06:10:09'),
(108, NULL, 'tambah', 'beasiswa', 23, NULL, '{\"judul\":\"Beasiswa Prestasi Uji 1795390172833\"}', '2026-11-23 06:29:32'),
(109, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-23 06:29:33'),
(110, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 06:29:33'),
(111, 1, 'tambah', 'pengguna', 19, NULL, '{\"nama_pengguna\":\"stg2_user_1795390173824\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\"}', '2026-11-23 06:29:33'),
(112, 1, 'ubah', 'pengguna', 19, '{\"nama_pengguna\":\"stg2_user_1795390173824\",\"nama_lengkap\":\"Staff Operator Pengujian\",\"peran\":\"admin\",\"aktif\":true}', '{\"nama_pengguna\":\"stg2_user_1795390173824\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\",\"peran\":\"admin\",\"aktif\":true}', '2026-11-23 06:29:33'),
(113, 1, 'ubah', 'pengguna', 19, '{\"aktif\":true}', '{\"aktif\":0}', '2026-11-23 06:29:33'),
(114, 1, 'ubah', 'pengguna', 19, '{\"aktif\":false}', '{\"aktif\":1}', '2026-11-23 06:29:33'),
(115, 1, 'hapus', 'pengguna', 19, '{\"nama_pengguna\":\"stg2_user_1795390173824\",\"nama_lengkap\":\"Staff Operator Pengujian (Updated)\"}', NULL, '2026-11-23 06:29:33'),
(116, 1, 'tambah', 'pengguna', 20, NULL, '{\"nama_pengguna\":\"ref_admin_1795390173981\",\"nama_lengkap\":\"Admin Kontributor Beasiswa\",\"peran\":\"admin\"}', '2026-11-23 06:29:34'),
(117, 1, 'arsip', 'pengguna', 20, '{\"nama_pengguna\":\"ref_admin_1795390173981\",\"aktif\":true}', '{\"aktif\":false,\"alasan\":\"Akun memiliki relasi data konten beasiswa sehingga dinonaktifkan\"}', '2026-11-23 06:29:34'),
(118, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 08:02:26'),
(119, 1, 'masuk', 'pengguna', 1, NULL, '{\"nama_pengguna\":\"admin_utama\",\"ip\":\"::1\"}', '2026-11-23 08:11:45'),
(120, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 10:51:36'),
(121, 2, 'masuk', 'pengguna', 2, NULL, '{\"nama_pengguna\":\"admin\",\"ip\":\"::1\"}', '2026-11-23 11:03:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengaturan_situs`
--

CREATE TABLE `pengaturan_situs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `kunci_pengaturan` varchar(100) NOT NULL,
  `kelompok_pengaturan` varchar(40) NOT NULL DEFAULT 'umum',
  `nama_pengaturan` varchar(120) NOT NULL,
  `nilai_pengaturan` text DEFAULT NULL,
  `jenis_nilai` enum('teks','teks_panjang','url','email','angka','boolean') NOT NULL DEFAULT 'teks',
  `tampil_publik` tinyint(1) NOT NULL DEFAULT 1,
  `diperbarui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `pengaturan_situs`
--

INSERT INTO `pengaturan_situs` (`id`, `kunci_pengaturan`, `kelompok_pengaturan`, `nama_pengaturan`, `nilai_pengaturan`, `jenis_nilai`, `tampil_publik`, `diperbarui_oleh`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, 'nama_website', 'umum', 'Nama Website', 'Informasi Beasiswa Politeknik Negeri Lampung', 'teks', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(2, 'judul_beranda', 'umum', 'Judul Beranda', 'Temukan Informasi Beasiswa', 'teks', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(3, 'deskripsi_beranda', 'umum', 'Deskripsi Beranda', 'Cari informasi beasiswa, persyaratan, jadwal, dan tautan pendaftaran dalam satu tempat.', 'teks_panjang', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(4, 'tentang_website', 'umum', 'Tentang Website', 'Website ini menyediakan informasi beasiswa bagi mahasiswa Politeknik Negeri Lampung.', 'teks_panjang', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(5, 'email_kontak', 'kontak', 'Email Kontak', NULL, 'email', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(6, 'url_logo', 'tampilan', 'Alamat Logo Website', '/images/polinela-logo.png', 'url', 1, NULL, '2026-11-10 10:59:06', '2026-11-23 06:26:15'),
(7, 'url_instagram', 'media_sosial', 'Alamat Instagram', NULL, 'url', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(8, 'teks_footer', 'umum', 'Teks Footer', 'Politeknik Negeri Lampung', 'teks', 1, 1, '2026-11-10 10:59:06', '2026-11-22 21:06:50'),
(9, 'pengumuman_bergerak_aktif', 'pengumuman', 'Aktifkan Pengumuman Bergerak', '1', 'boolean', 1, NULL, '2026-11-10 10:59:06', '2026-11-10 10:59:06'),
(10, 'durasi_pengumuman_detik', 'pengumuman', 'Durasi Animasi Pengumuman (detik)', '20', 'angka', 1, 1, '2026-11-10 10:59:06', '2026-11-22 21:06:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengguna`
--

CREATE TABLE `pengguna` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_pengguna` varchar(80) NOT NULL,
  `hash_kata_sandi` varchar(255) NOT NULL,
  `nama_lengkap` varchar(150) NOT NULL,
  `peran` enum('admin_utama','admin') NOT NULL DEFAULT 'admin',
  `aktif` tinyint(1) NOT NULL DEFAULT 1,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `pengguna`
--

INSERT INTO `pengguna` (`id`, `nama_pengguna`, `hash_kata_sandi`, `nama_lengkap`, `peran`, `aktif`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, 'admin_utama', '$2b$10$.gZf0JbKWG2isertf4Ku7uru3KxC1tJDss9N9L/RIavZD5sdPcrlO', 'Super Administrator POLINELA', 'admin_utama', 1, '2026-11-22 20:22:03', '2026-11-22 20:22:03'),
(2, 'admin', '$2b$10$FtTURpepVWK2pb9HzCulhOvA1Jc0jBhZ.kcj/oSKKUBiV1Tn9Cl1u', 'Administrator Konten POLINELA', 'admin', 1, '2026-11-22 20:22:03', '2026-11-22 20:22:03');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengumuman`
--

CREATE TABLE `pengumuman` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `judul` varchar(160) NOT NULL,
  `isi_pengumuman` varchar(500) NOT NULL,
  `url_tujuan` varchar(2048) DEFAULT NULL,
  `aktif` tinyint(1) NOT NULL DEFAULT 0,
  `mulai_tayang` datetime DEFAULT NULL,
  `akhir_tayang` datetime DEFAULT NULL,
  `urutan_tampil` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dibuat_oleh` bigint(20) UNSIGNED NOT NULL,
  `diperbarui_oleh` bigint(20) UNSIGNED DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `pengumuman`
--

INSERT INTO `pengumuman` (`id`, `judul`, `isi_pengumuman`, `url_tujuan`, `aktif`, `mulai_tayang`, `akhir_tayang`, `urutan_tampil`, `dibuat_oleh`, `diperbarui_oleh`, `dibuat_pada`, `diperbarui_pada`) VALUES
(2, 'Pembaruan Jadwal Pendaftaran Beasiswa 2026', 'Pendaftaran program Beasiswa Bank Indonesia dan KIP Kuliah 2026 kini telah resmi dibuka. Silakan cek detail persyaratan lengkap.', 'https://polinela.ac.id/beasiswa', 1, NULL, NULL, 1, 1, NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(3, 'Sosialisasi Beasiswa Djarum Plus di Gedung Serba Guna POLINELA', 'Jangan lewatkan sesi informasi langsung bersama tim Djarum Foundation pada tanggal 10 April 2026.', NULL, 1, NULL, NULL, 2, 1, NULL, '2026-11-22 20:22:04', '2026-11-22 20:22:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `penyelenggara_beasiswa`
--

CREATE TABLE `penyelenggara_beasiswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_penyelenggara` varchar(180) NOT NULL,
  `url_website` varchar(2048) DEFAULT NULL,
  `email_kontak` varchar(254) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `penyelenggara_beasiswa`
--

INSERT INTO `penyelenggara_beasiswa` (`id`, `nama_penyelenggara`, `url_website`, `email_kontak`, `alamat`, `deskripsi`, `dibuat_pada`, `diperbarui_pada`) VALUES
(2, 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi', 'https://beasiswa.kemdikbud.go.id', 'beasiswa@kemdikbud.go.id', 'Jakarta Pusat', 'Instansi pemerintah penyelenggara beasiswa pendidikan tinggi', '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(3, 'Lembaga Pengelola Dana Pendidikan (LPDP)', 'https://lpdp.kemenkeu.go.id', 'cso.lpdp@kemenkeu.go.id', 'Jakarta Pusat', 'Lembaga pengelola dana abadi pendidikan di bawah Kementerian Keuangan', '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(4, 'Djarum Foundation', 'https://djarumbeasiswaplus.org', 'kontak@djarumbeasiswaplus.org', 'Kudus, Jawa Tengah', 'Penyelenggara program Djarum Beasiswa Plus', '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(5, 'Bank Indonesia', 'https://www.bi.go.id', 'bicara@bi.go.id', 'Jakarta', 'Bank Sentral Republik Indonesia', '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(6, 'Politeknik Negeri Lampung (POLINELA)', 'https://polinela.ac.id', 'humas@polinela.ac.id', 'Jl. Soekarno Hatta No.10, Rajabasa, Bandar Lampung', 'Perguruan Tinggi Vokasi Negeri terkemuka di Lampung', '2026-11-22 20:22:04', '2026-11-22 20:22:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `persyaratan_beasiswa`
--

CREATE TABLE `persyaratan_beasiswa` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `beasiswa_id` bigint(20) UNSIGNED NOT NULL,
  `nama_persyaratan` text NOT NULL,
  `jenis_persyaratan` enum('umum','akademik','administrasi','lainnya') NOT NULL DEFAULT 'umum',
  `wajib` tinyint(1) NOT NULL DEFAULT 1,
  `urutan_tampil` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `dibuat_pada` datetime NOT NULL DEFAULT current_timestamp(),
  `diperbarui_pada` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data untuk tabel `persyaratan_beasiswa`
--

INSERT INTO `persyaratan_beasiswa` (`id`, `beasiswa_id`, `nama_persyaratan`, `jenis_persyaratan`, `wajib`, `urutan_tampil`, `dibuat_pada`, `diperbarui_pada`) VALUES
(3, 2, 'Mahasiswa aktif POLINELA jenjang D3 atau Sarjana Terapan (D4)', 'umum', 1, 1, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(4, 2, 'Memiliki Kartu Indonesia Pintar (KIP) atau terdaftar di DTKS Kemensos', 'administrasi', 1, 2, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(5, 2, 'Surat Keterangan Penghasilan orang tua gabungan maksimal Rp 4.000.000 / bulan atau SKTM', 'administrasi', 1, 3, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(6, 2, 'Mempertahankan IPK minimal 3.00 pada setiap semester', 'akademik', 1, 4, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(7, 2, 'Scan KTP, Kartu Keluarga, dan Kartu Tanda Mahasiswa (KTM)', 'administrasi', 1, 5, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(8, 3, 'Sedang menempuh pendidikan Sarjana Terapan (D4) semester IV pada saat pendaftaran', 'umum', 1, 1, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(9, 3, 'IPK minimum 3.20 pada semester III', 'akademik', 1, 2, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(10, 3, 'Aktif mengikuti kegiatan organisasi baik di dalam maupun di luar kampus', 'umum', 0, 3, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(11, 3, 'Tidak sedang menerima beasiswa dari pihak lain', 'umum', 1, 4, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(12, 3, 'Scan transkrip nilai resmi yang dilegalisir fakultas/jurusan', 'administrasi', 1, 5, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(13, 4, 'Mahasiswa aktif POLINELA minimal semester 3 dan maksimal semester 6', 'umum', 1, 1, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(14, 4, 'Memiliki Indeks Prestasi Kumulatif (IPK) minimal 3.25 skala 4.00', 'akademik', 1, 2, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(15, 4, 'Membuat resume pribadi (CV) dan Motivation Letter berbahasa Indonesia', 'administrasi', 1, 3, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(16, 4, 'Surat rekomendasi dari Jurusan / Wakil Direktur III Bidang Kemahasiswaan', 'administrasi', 1, 4, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(17, 4, 'Berusia maksimal 23 tahun pada saat mendaftar', 'umum', 1, 5, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(18, 5, 'Mahasiswa aktif POLINELA semester 2 hingga semester 7', 'umum', 1, 1, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(19, 5, 'IPK minimal 3.50 tanpa nilai mata kuliah di bawah B', 'akademik', 1, 2, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(20, 5, 'Melampirkan sertifikat kejuaraan/penghargaan akademik minimal tingkat kota/provinsi', 'akademik', 0, 3, '2026-11-22 20:22:04', '2026-11-22 20:22:04'),
(21, 5, 'Surat keterangan berkelakuan baik dan tidak pernah melanggar tata tertib kampus', 'administrasi', 1, 4, '2026-11-22 20:22:04', '2026-11-22 20:22:04');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `beasiswa`
--
ALTER TABLE `beasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_beasiswa_pembuat` (`dibuat_oleh`),
  ADD KEY `fk_beasiswa_pengubah` (`diperbarui_oleh`),
  ADD KEY `idx_beasiswa_status_jadwal` (`status_publikasi`,`tanggal_buka`,`tanggal_tutup`),
  ADD KEY `idx_beasiswa_kategori` (`kategori_id`),
  ADD KEY `idx_beasiswa_penyelenggara` (`penyelenggara_id`);

--
-- Indeks untuk tabel `kategori_beasiswa`
--
ALTER TABLE `kategori_beasiswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_log_entitas` (`jenis_entitas`,`id_entitas`),
  ADD KEY `idx_log_pengguna_waktu` (`pengguna_id`,`dibuat_pada`);

--
-- Indeks untuk tabel `pengaturan_situs`
--
ALTER TABLE `pengaturan_situs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kunci_pengaturan` (`kunci_pengaturan`),
  ADD KEY `fk_pengaturan_pengubah` (`diperbarui_oleh`),
  ADD KEY `idx_pengaturan_kelompok_publik` (`kelompok_pengaturan`,`tampil_publik`);

--
-- Indeks untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nama_pengguna` (`nama_pengguna`);

--
-- Indeks untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pengumuman_pembuat` (`dibuat_oleh`),
  ADD KEY `fk_pengumuman_pengubah` (`diperbarui_oleh`),
  ADD KEY `idx_pengumuman_tayang` (`aktif`,`urutan_tampil`,`mulai_tayang`,`akhir_tayang`);

--
-- Indeks untuk tabel `penyelenggara_beasiswa`
--
ALTER TABLE `penyelenggara_beasiswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_penyelenggara_nama` (`nama_penyelenggara`);

--
-- Indeks untuk tabel `persyaratan_beasiswa`
--
ALTER TABLE `persyaratan_beasiswa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_persyaratan_beasiswa_urutan` (`beasiswa_id`,`urutan_tampil`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `beasiswa`
--
ALTER TABLE `beasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kategori_beasiswa`
--
ALTER TABLE `kategori_beasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT untuk tabel `pengaturan_situs`
--
ALTER TABLE `pengaturan_situs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pengguna`
--
ALTER TABLE `pengguna`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `penyelenggara_beasiswa`
--
ALTER TABLE `penyelenggara_beasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `persyaratan_beasiswa`
--
ALTER TABLE `persyaratan_beasiswa`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `beasiswa`
--
ALTER TABLE `beasiswa`
  ADD CONSTRAINT `fk_beasiswa_kategori` FOREIGN KEY (`kategori_id`) REFERENCES `kategori_beasiswa` (`id`),
  ADD CONSTRAINT `fk_beasiswa_pembuat` FOREIGN KEY (`dibuat_oleh`) REFERENCES `pengguna` (`id`),
  ADD CONSTRAINT `fk_beasiswa_pengubah` FOREIGN KEY (`diperbarui_oleh`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_beasiswa_penyelenggara` FOREIGN KEY (`penyelenggara_id`) REFERENCES `penyelenggara_beasiswa` (`id`);

--
-- Ketidakleluasaan untuk tabel `log_aktivitas`
--
ALTER TABLE `log_aktivitas`
  ADD CONSTRAINT `fk_log_pengguna` FOREIGN KEY (`pengguna_id`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pengaturan_situs`
--
ALTER TABLE `pengaturan_situs`
  ADD CONSTRAINT `fk_pengaturan_pengubah` FOREIGN KEY (`diperbarui_oleh`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `pengumuman`
--
ALTER TABLE `pengumuman`
  ADD CONSTRAINT `fk_pengumuman_pembuat` FOREIGN KEY (`dibuat_oleh`) REFERENCES `pengguna` (`id`),
  ADD CONSTRAINT `fk_pengumuman_pengubah` FOREIGN KEY (`diperbarui_oleh`) REFERENCES `pengguna` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `persyaratan_beasiswa`
--
ALTER TABLE `persyaratan_beasiswa`
  ADD CONSTRAINT `fk_persyaratan_beasiswa` FOREIGN KEY (`beasiswa_id`) REFERENCES `beasiswa` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
