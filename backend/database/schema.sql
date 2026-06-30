CREATE TABLE IF NOT EXISTS akun_admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kategori_beasiswa (
    id SERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS penyedia_beasiswa (
    id SERIAL PRIMARY KEY,
    nama_penyedia VARCHAR(150) NOT NULL,
    jenis_penyedia VARCHAR(50) NOT NULL,
    kontak VARCHAR(100),
    website VARCHAR(255),
    alamat TEXT,
    logo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS informasi_beasiswa (
    id SERIAL PRIMARY KEY,
    kategori_id INT NOT NULL,
    penyedia_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    jenjang_pendidikan VARCHAR(100) NOT NULL,
    kuota INT,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'aktif',
    poster VARCHAR(255),
    link_pendaftaran VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kategori_id) REFERENCES kategori_beasiswa(id) ON DELETE CASCADE,
    FOREIGN KEY (penyedia_id) REFERENCES penyedia_beasiswa(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS syarat_beasiswa (
    id SERIAL PRIMARY KEY,
    beasiswa_id INT NOT NULL,
    syarat_dokumen TEXT NOT NULL,
    ipk_minimal DECIMAL(3,2),
    syarat_lainnya TEXT,
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
