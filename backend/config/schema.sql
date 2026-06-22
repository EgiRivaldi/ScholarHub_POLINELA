-- =============================================
-- ScholarHub POLINELA — Database Schema
-- Database: scholarhub_polinela
-- =============================================

CREATE DATABASE IF NOT EXISTS scholarhub_polinela
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE scholarhub_polinela;

-- =============================================
-- Table: kategori_beasiswa
-- =============================================
CREATE TABLE IF NOT EXISTS kategori_beasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL UNIQUE,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: penyedia_beasiswa
-- =============================================
CREATE TABLE IF NOT EXISTS penyedia_beasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_penyedia VARCHAR(200) NOT NULL UNIQUE,
  singkatan VARCHAR(50),
  website VARCHAR(255),
  logo VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================
-- Table: informasi_beasiswa
-- =============================================
CREATE TABLE IF NOT EXISTS informasi_beasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_beasiswa VARCHAR(255) NOT NULL UNIQUE,
  deskripsi TEXT,
  gambar VARCHAR(255),
  tanggal_buka DATE NOT NULL,
  tanggal_tutup DATE NOT NULL,
  url_pendaftaran VARCHAR(500) NOT NULL,
  kategori_id INT,
  penyedia_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategori_beasiswa(id) ON DELETE SET NULL,
  FOREIGN KEY (penyedia_id) REFERENCES penyedia_beasiswa(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =============================================
-- Table: syarat_beasiswa
-- =============================================
CREATE TABLE IF NOT EXISTS syarat_beasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  beasiswa_id INT NOT NULL UNIQUE,
  ipk_minimum DECIMAL(3,2) DEFAULT 0.00,
  semester_minimum INT DEFAULT 1,
  dokumen_persyaratan TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (beasiswa_id) REFERENCES informasi_beasiswa(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================
-- Table: akun_admin
-- =============================================
CREATE TABLE IF NOT EXISTS akun_admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
