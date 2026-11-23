const { pool, testConnection } = require('../config/database');
const adminModel = require('../models/adminModel');
const categoryModel = require('../models/categoryModel');
const providerModel = require('../models/providerModel');
const scholarshipModel = require('../models/scholarshipModel');
const requirementModel = require('../models/requirementModel');
const settingModel = require('../models/settingModel');
const announcementModel = require('../models/announcementModel');
const activityLogModel = require('../models/activityLogModel');
const dashboardModel = require('../models/dashboardModel');

const runTest = async () => {
  console.log('=== TEST TAHAP 1: KONEKSI & MODEL MYSQL ===');

  // 1. Test Connection
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error('Koneksi MySQL gagal!');
  }
  console.log('✔ 1. Test koneksi MySQL: BERHASIL');

  // 2. Test Admin / Pengguna Model
  const testUsername = `test_admin_${Date.now()}`;
  const userId = await adminModel.create({
    nama_pengguna: testUsername,
    hash_kata_sandi: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
    nama_lengkap: 'Pengguna Uji Tahap 1',
    peran: 'admin_utama',
    aktif: 1
  });
  console.log(`✔ 2. Admin Model Create (id=${userId}): BERHASIL`);

  const fetchedUser = await adminModel.findByUsername(testUsername);
  if (!fetchedUser || fetchedUser.id !== userId) throw new Error('findByUsername gagal');
  console.log('✔ 2b. Admin Model findByUsername: BERHASIL');

  await adminModel.update(userId, { nama_lengkap: 'Pengguna Uji Update' });
  const updatedUser = await adminModel.findById(userId);
  if (updatedUser.nama_lengkap !== 'Pengguna Uji Update') throw new Error('update user gagal');
  console.log('✔ 2c. Admin Model update & findById: BERHASIL');

  // 3. Test Kategori Model
  const catName = `Kategori Uji ${Date.now()}`;
  const catId = await categoryModel.create({
    nama_kategori: catName,
    deskripsi: 'Deskripsi uji'
  });
  console.log(`✔ 3. Kategori Model Create (id=${catId}): BERHASIL`);

  const fetchedCat = await categoryModel.findById(catId);
  if (!fetchedCat || fetchedCat.nama_kategori !== catName) throw new Error('findById kategori gagal');
  console.log(`✔ 3b. Kategori Model findById & slug (${fetchedCat.slug}): BERHASIL`);

  // 4. Test Penyelenggara Model
  const provName = `Penyelenggara Uji ${Date.now()}`;
  const provId = await providerModel.create({
    nama_penyelenggara: provName,
    url_website: 'https://example.com',
    email_kontak: 'info@example.com',
    deskripsi: 'Deskripsi penyelenggara uji'
  });
  console.log(`✔ 4. Penyelenggara Model Create (id=${provId}): BERHASIL`);

  const fetchedProv = await providerModel.findById(provId);
  if (!fetchedProv || fetchedProv.nama_penyelenggara !== provName) throw new Error('findById penyelenggara gagal');
  console.log('✔ 4b. Penyelenggara Model findById: BERHASIL');

  // 5. Test Beasiswa Model
  const beasiswaJudul = `Beasiswa Prestasi Uji ${Date.now()}`;
  const beasiswaId = await scholarshipModel.create({
    dibuat_oleh: userId,
    kategori_id: catId,
    penyelenggara_id: provId,
    judul: beasiswaJudul,
    ringkasan: 'Ringkasan beasiswa uji tahap 1',
    deskripsi: 'Deskripsi lengkap beasiswa uji tahap 1',
    url_pendaftaran: 'https://polinela.ac.id/daftar',
    tanggal_buka: '2026-01-01',
    tanggal_tutup: '2026-12-31',
    status_publikasi: 'terbit'
  });
  console.log(`✔ 5. Beasiswa Model Create (id=${beasiswaId}): BERHASIL`);

  const fetchedBeasiswa = await scholarshipModel.findById(beasiswaId);
  if (!fetchedBeasiswa || fetchedBeasiswa.judul !== beasiswaJudul) throw new Error('findById beasiswa gagal');
  console.log(`✔ 5b. Beasiswa Model findById (status_pendaftaran=${fetchedBeasiswa.status_pendaftaran}): BERHASIL`);

  const beasiswaList = await scholarshipModel.findAll({ kategori_id: catId });
  if (beasiswaList.length === 0) throw new Error('findAll beasiswa gagal');
  console.log('✔ 5c. Beasiswa Model findAll & filter: BERHASIL');

  // 6. Test Persyaratan Model (banyak record)
  const req1 = await requirementModel.create({
    beasiswa_id: beasiswaId,
    nama_persyaratan: 'IPK minimal 3.25',
    jenis_persyaratan: 'akademik',
    wajib: 1,
    urutan_tampil: 1
  });
  const req2 = await requirementModel.create({
    beasiswa_id: beasiswaId,
    nama_persyaratan: 'Scan KTP dan KTM aktif',
    jenis_persyaratan: 'administrasi',
    wajib: 1,
    urutan_tampil: 2
  });
  console.log(`✔ 6. Persyaratan Model Create (req1=${req1}, req2=${req2}): BERHASIL`);

  const reqList = await requirementModel.findByScholarshipId(beasiswaId);
  if (reqList.length !== 2) throw new Error(`findByScholarshipId gagal, panjang: ${reqList.length}`);
  console.log(`✔ 6b. Persyaratan Model findByScholarshipId (${reqList.length} baris syarat): BERHASIL`);

  // 7. Test Pengaturan Situs Model
  const publicSettings = await settingModel.findPublic();
  console.log(`✔ 7. Pengaturan Situs findPublic (${Object.keys(publicSettings).length} kunci publik): BERHASIL`);

  // 8. Test Pengumuman Model
  const pengumumanId = await announcementModel.create({
    judul: 'Pengumuman Uji Tahap 1',
    isi_pengumuman: 'Isi pengumuman uji tahap 1',
    aktif: 1,
    dibuat_oleh: userId
  });
  console.log(`✔ 8. Pengumuman Model Create (id=${pengumumanId}): BERHASIL`);

  // 9. Test Log Aktivitas Model
  const logId = await activityLogModel.log({
    pengguna_id: userId,
    aksi: 'tambah',
    jenis_entitas: 'beasiswa',
    id_entitas: beasiswaId,
    data_sesudah: { judul: beasiswaJudul }
  });
  console.log(`✔ 9. Log Aktivitas Model (id=${logId}): BERHASIL`);

  // 10. Test Dashboard Model
  const stats = await dashboardModel.getStats();
  console.log(`✔ 10. Dashboard Stats:`, stats);

  // CLEANUP TEST DATA
  console.log('--- Pembersihan data uji ---');
  await requirementModel.deleteByScholarshipId(beasiswaId);
  await scholarshipModel.delete(beasiswaId);
  await categoryModel.delete(catId);
  await providerModel.delete(provId);
  await announcementModel.delete(pengumumanId);
  await adminModel.delete(userId);
  console.log('✔ Pembersihan data uji selesai. Data asli tetap utuh.');

  console.log('=== SEMUA UJI TAHAP 1 BERHASIL DILALUI! ===');
  await pool.end();
};

runTest().catch((err) => {
  console.error('❌ UJI GAGAL:', err);
  process.exit(1);
});
