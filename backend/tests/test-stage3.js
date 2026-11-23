const { pool } = require('../config/database');

const API_BASE = 'http://localhost:5000/api';

const req = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  const response = await fetch(url, fetchOptions);
  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }
  return { status: response.status, data };
};

const runStage3Tests = async () => {
  console.log('=== TEST TAHAP 3: CRUD DATA INTI & ATURAN BISNIS ===\n');

  // 1. Dapatkan token admin
  const loginRes = await req('/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'admin123' },
  });
  if (loginRes.status !== 200 || !loginRes.data?.data?.token) {
    throw new Error('Login admin gagal');
  }
  const token = loginRes.data.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Dapatkan sample kategori dan penyelenggara
  const [cats] = await pool.query('SELECT id FROM kategori_beasiswa LIMIT 1');
  const [provs] = await pool.query('SELECT id FROM penyelenggara_beasiswa LIMIT 1');
  const catId = cats[0].id;
  const provId = provs[0].id;

  // 2. Uji Status Publikasi: 'draf', 'terbit', 'arsip'
  console.log('1. Uji Kontrol Status Publikasi (Draf vs Terbit):');
  
  // 2a. Buat beasiswa draf
  const draftRes = await req('/scholarships', {
    method: 'POST',
    headers: authHeaders,
    body: {
      judul: `Beasiswa Draf Uji ${Date.now()}`,
      ringkasan: 'Beasiswa draf yang belum boleh dilihat publik',
      deskripsi: 'Deskripsi lengkap draf beasiswa',
      kategori_id: catId,
      penyelenggara_id: provId,
      tanggal_buka: '2026-01-01',
      tanggal_tutup: '2026-12-31',
      status_publikasi: 'draf',
    },
  });
  if (draftRes.status !== 201) throw new Error(`Gagal buat draf: ${JSON.stringify(draftRes.data)}`);
  const draftId = draftRes.data.data.id;
  const draftSlug = draftRes.data.data.slug;
  console.log(`✔ Beasiswa DRAF berhasil dibuat (ID: ${draftId})`);

  // 2b. Buat beasiswa terbit yang sudah lewat deadline (ditutup)
  const pastRes = await req('/scholarships', {
    method: 'POST',
    headers: authHeaders,
    body: {
      judul: `Beasiswa Terbit Lewat Deadline Uji ${Date.now()}`,
      ringkasan: 'Beasiswa terbit tapi jadwal sudah berakhir',
      deskripsi: 'Deskripsi beasiswa yang sudah lewat tenggat',
      kategori_id: catId,
      penyelenggara_id: provId,
      tanggal_buka: '2025-01-01',
      tanggal_tutup: '2025-05-01',
      status_publikasi: 'terbit',
    },
  });
  if (pastRes.status !== 201) throw new Error(`Gagal buat beasiswa terbit expired: ${JSON.stringify(pastRes.data)}`);
  const pastId = pastRes.data.data.id;
  console.log(`✔ Beasiswa TERBIT (Expired) berhasil dibuat (ID: ${pastId})`);

  // 2c. Request PUBLIK (tanpa token) ke daftar beasiswa
  const publicList = await req('/scholarships');
  if (publicList.status !== 200) throw new Error('Public GET scholarships failed');
  const publicItems = publicList.data.data;
  
  // Pastikan draf TIDAK ADA di list publik
  const draftInPublic = publicItems.find((s) => s.id === draftId);
  if (draftInPublic) {
    throw new Error('PELANGGARAN: Beasiswa berstatus DRAF bocor ke URL publik!');
  }
  console.log('✔ Privasi Terjamin: Beasiswa DRAF TIDAK muncul di daftar publik');

  // Pastikan beasiswa terbit yang lewat deadline TETAP MUNCUL di publik (status_publikasi: terbit, status_pendaftaran: ditutup)
  const pastInPublic = publicItems.find((s) => s.id === pastId);
  if (!pastInPublic) {
    throw new Error('Beasiswa terbit yang sudah lewat tenggat seharusnya tetap tampil di publik');
  }
  if (pastInPublic.status_pendaftaran !== 'ditutup') {
    throw new Error(`Ekspektasi status_pendaftaran 'ditutup', tapi mendapatkan: ${pastInPublic.status_pendaftaran}`);
  }
  console.log(`✔ Aturan Bisnis Terpenuhi: Beasiswa lewat deadline tetap tampil di publik dengan status_pendaftaran='ditutup'`);

  // 2d. Request PUBLIK langsung membuka detail draf via ID / slug -> WAJIB 404!
  const publicDraftById = await req(`/scholarships/${draftId}`);
  if (publicDraftById.status === 404) {
    console.log('✔ Akses publik ke URL detail beasiswa DRAF ditolak dengan HTTP 404');
  } else {
    throw new Error(`Publik tidak boleh melihat detail beasiswa draf! Menerima status: ${publicDraftById.status}`);
  }

  // 2e. Request ADMIN ke daftar beasiswa dengan filter status_publikasi=draf -> WAJIB muncul!
  const adminDraftList = await req('/scholarships?status_publikasi=draf', { headers: authHeaders });
  const adminFoundDraft = adminDraftList.data.data.find((s) => s.id === draftId);
  if (adminFoundDraft) {
    console.log('✔ Admin berhasil melihat beasiswa DRAF di panel admin');
  } else {
    throw new Error('Admin seharusnya bisa melihat draf dengan filter');
  }

  // 3. Uji Persyaratan Multi-Record (Banyak baris syarat per beasiswa)
  console.log('\n2. Uji Persyaratan Multi-Record per Beasiswa:');
  const bulkReqRes = await req('/requirements/bulk', {
    method: 'POST',
    headers: authHeaders,
    body: {
      beasiswa_id: pastId,
      requirements: [
        { nama_persyaratan: 'Mahasiswa aktif POLINELA jenjang D3/D4', jenis_persyaratan: 'umum', wajib: 1, urutan_tampil: 1 },
        { nama_persyaratan: 'IPK minimal 3.25 skala 4.00', jenis_persyaratan: 'akademik', wajib: 1, urutan_tampil: 2 },
        { nama_persyaratan: 'Scan KTP dan KTM yang masih berlaku', jenis_persyaratan: 'administrasi', wajib: 1, urutan_tampil: 3 },
        { nama_persyaratan: 'Surat rekomendasi dari Ketua Jurusan', jenis_persyaratan: 'administrasi', wajib: 1, urutan_tampil: 4 },
        { nama_persyaratan: 'Piagam kejuaraan atau sertifikat kompetisi (jika ada)', jenis_persyaratan: 'lainnya', wajib: 0, urutan_tampil: 5 },
      ],
    },
  });
  if (bulkReqRes.status !== 200 || bulkReqRes.data.data.length !== 5) {
    throw new Error(`Bulk insert persyaratan gagal: ${JSON.stringify(bulkReqRes.data)}`);
  }
  console.log(`✔ Bulk insert persyaratan berhasil (5 baris syarat tersimpan)`);

  // Verifikasi via GET /scholarships/:id (sudah otomatis ter-join)
  const detailRes = await req(`/scholarships/${pastId}`);
  if (detailRes.status !== 200 || !Array.isArray(detailRes.data.data.persyaratan)) {
    throw new Error('Detail beasiswa gagal menyertakan relasi persyaratan');
  }
  console.log(`✔ Relasi Persyaratan otomatis terlampir di detail beasiswa: ${detailRes.data.data.persyaratan.length} butir`);

  // 4. Uji Pencarian, Filter Kategori, Sorting, dan Paginasi API
  console.log('\n3. Uji Pencarian, Filter, Sorting, & Paginasi:');
  
  // 4a. Pencarian keyword spesifik
  const searchRes = await req('/scholarships?search=Lewat+Deadline');
  if (searchRes.status !== 200 || searchRes.data.data.length === 0) {
    throw new Error('Pencarian beasiswa tidak menghasilkan data');
  }
  console.log(`✔ Pencarian keyword 'Lewat Deadline' berhasil (${searchRes.data.pagination.total} data ditemukan)`);

  // 4b. Filter status_pendaftaran=ditutup
  const closedRes = await req('/scholarships?status_pendaftaran=ditutup');
  if (closedRes.status !== 200) throw new Error('Filter status_pendaftaran ditutup gagal');
  const allClosed = closedRes.data.data.every((s) => s.status_pendaftaran === 'ditutup');
  if (!allClosed) throw new Error('Filter status_pendaftaran mengembalikan data yang tidak sesuai');
  console.log(`✔ Filter status pendaftaran 'ditutup' berhasil`);

  // 4c. Paginasi API
  const pageRes = await req('/scholarships?limit=2&page=1');
  if (pageRes.status !== 200 || pageRes.data.data.length > 2) {
    throw new Error('Paginasi limit tidak berfungsi');
  }
  console.log(`✔ Paginasi limit=2 page=1 berhasil (Total halaman: ${pageRes.data.pagination.totalPages})`);

  // 5. Uji Integritas Relasional Kategori & Penyelenggara
  console.log('\n4. Uji Integritas Relasional Kategori & Penyelenggara:');
  
  // Upaya menghapus kategori yang sedang dipakai beasiswa -> WAJIB 400 DITOLAK!
  const delCatRes = await req(`/categories/${catId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delCatRes.status === 400) {
    console.log(`✔ Upaya menghapus kategori terpakai DITOLAK dengan aman (HTTP 400): ${delCatRes.data.message}`);
  } else {
    throw new Error(`Kategori terpakai seharusnya ditolak! Menerima status: ${delCatRes.status}`);
  }

  // Upaya menghapus penyelenggara yang sedang dipakai beasiswa -> WAJIB 400 DITOLAK!
  const delProvRes = await req(`/providers/${provId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  if (delProvRes.status === 400) {
    console.log(`✔ Upaya menghapus penyelenggara terpakai DITOLAK dengan aman (HTTP 400): ${delProvRes.data.message}`);
  } else {
    throw new Error(`Penyelenggara terpakai seharusnya ditolak! Menerima status: ${delProvRes.status}`);
  }

  // 6. Pembersihan Data Uji
  console.log('\n--- Pembersihan Data Uji ---');
  await req(`/scholarships/${draftId}`, { method: 'DELETE', headers: authHeaders });
  await req(`/scholarships/${pastId}`, { method: 'DELETE', headers: authHeaders });
  console.log('✔ Beasiswa uji berhasil dihapus.');

  console.log('\n=== SEMUA SKENARIO UJI TAHAP 3 BERHASIL 100%! ===');
  await pool.end();
};

runStage3Tests().catch((err) => {
  console.error('\n❌ UJI TAHAP 3 GAGAL:', err.message);
  process.exit(1);
});
