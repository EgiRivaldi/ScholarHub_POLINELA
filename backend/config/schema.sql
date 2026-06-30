CREATE TABLE IF NOT EXISTS akun_admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kategori_beasiswa (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS penyedia_beasiswa (
    id SERIAL PRIMARY KEY,
    nama_penyedia VARCHAR(200) NOT NULL UNIQUE,
    singkatan VARCHAR(50),
    website VARCHAR(255),
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS informasi_beasiswa (
    id SERIAL PRIMARY KEY,
    nama_beasiswa VARCHAR(255) NOT NULL UNIQUE,
    deskripsi TEXT,
    gambar VARCHAR(255),
    tanggal_buka DATE NOT NULL,
    tanggal_tutup DATE NOT NULL,
    url_pendaftaran VARCHAR(500) NOT NULL,
    kategori_id INT,
    penyedia_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori_beasiswa(id) ON DELETE SET NULL,
    FOREIGN KEY (penyedia_id) REFERENCES penyedia_beasiswa(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS syarat_beasiswa (
    id SERIAL PRIMARY KEY,
    beasiswa_id INT NOT NULL UNIQUE,
    ipk_minimum DECIMAL(3,2) DEFAULT 0.00,
    semester_minimum INT DEFAULT 1,
    dokumen_persyaratan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beasiswa_id) REFERENCES informasi_beasiswa(id) ON DELETE CASCADE
);

-- Buat function untuk update timestamp otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Buat trigger untuk semua tabel
CREATE TRIGGER update_admin_modtime BEFORE UPDATE ON akun_admin FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_kategori_modtime BEFORE UPDATE ON kategori_beasiswa FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_penyedia_modtime BEFORE UPDATE ON penyedia_beasiswa FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_beasiswa_modtime BEFORE UPDATE ON informasi_beasiswa FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_syarat_modtime BEFORE UPDATE ON syarat_beasiswa FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
