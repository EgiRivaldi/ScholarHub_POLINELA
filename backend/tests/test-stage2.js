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

const runStage2Tests = async () => {
  console.log('=== TEST TAHAP 2: AUTENTIKASI DAN OTORISASI ===\n');

  // 1. Uji Login Salah
  console.log('1. Uji Login Kredensial Salah:');
  const resWrongPass = await req('/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'wrongpassword' }
  });
  if (resWrongPass.status === 401 && resWrongPass.data.success === false) {
    console.log('✔ Password salah ditolak dengan HTTP 401:', resWrongPass.data.message);
  } else {
    throw new Error(`Ekspektasi 401 tapi menerima ${resWrongPass.status}`);
  }

  const resWrongUser = await req('/auth/login', {
    method: 'POST',
    body: { username: 'nonexistent_user_xyz', password: 'anypassword' }
  });
  if (resWrongUser.status === 401 && resWrongUser.data.success === false) {
    console.log('✔ Username tidak terdaftar ditolak dengan HTTP 401:', resWrongUser.data.message);
  } else {
    throw new Error(`Ekspektasi 401 tapi menerima ${resWrongUser.status}`);
  }

  // 2. Uji Login Valid: admin_utama & admin
  console.log('\n2. Uji Login Valid:');
  const resLoginUtama = await req('/auth/login', {
    method: 'POST',
    body: { username: 'admin_utama', password: 'admin123' }
  });
  if (resLoginUtama.status !== 200 || !resLoginUtama.data?.data?.token) {
    throw new Error(`Login admin_utama gagal: ${JSON.stringify(resLoginUtama.data)}`);
  }
  const tokenUtama = resLoginUtama.data.data.token;
  console.log(`✔ Login admin_utama BERHASIL (peran: ${resLoginUtama.data.data.peran})`);

  // Pastikan hash password TIDAK ADA pada response
  if (resLoginUtama.data.data.password || resLoginUtama.data.data.hash_kata_sandi) {
    throw new Error('KEAMANAN BOCOR: Password hash dikembalikan dalam response login!');
  }
  console.log('✔ Keamanan Terjamin: Password hash TIDAK dikembalikan pada response JSON');

  const resLoginAdmin = await req('/auth/login', {
    method: 'POST',
    body: { username: 'admin', password: 'admin123' }
  });
  if (resLoginAdmin.status !== 200 || !resLoginAdmin.data?.data?.token) {
    throw new Error(`Login admin gagal: ${JSON.stringify(resLoginAdmin.data)}`);
  }
  const tokenAdmin = resLoginAdmin.data.data.token;
  console.log(`✔ Login admin BERHASIL (peran: ${resLoginAdmin.data.data.peran})`);

  // 3. Uji Otorisasi Role: admin biasa vs admin_utama mengakses /api/admins
  console.log('\n3. Uji Otorisasi Hak Akses (Role Enforcement):');
  
  // 3a. Admin biasa mencoba akses /api/admins -> WAJIB 403 Forbidden!
  const resAdminAccessAdmins = await req('/admins', {
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  if (resAdminAccessAdmins.status === 403) {
    console.log('✔ Admin biasa DITOLAK mengakses /api/admins dengan HTTP 403 Forbidden:', resAdminAccessAdmins.data.message);
  } else {
    throw new Error(`Admin biasa seharusnya ditolak 403, tapi menerima HTTP ${resAdminAccessAdmins.status}`);
  }

  // 3b. Admin biasa mencoba akses /api/logs -> WAJIB 403 Forbidden!
  const resAdminAccessLogs = await req('/logs', {
    headers: { Authorization: `Bearer ${tokenAdmin}` }
  });
  if (resAdminAccessLogs.status === 403) {
    console.log('✔ Admin biasa DITOLAK mengakses /api/logs dengan HTTP 403 Forbidden:', resAdminAccessLogs.data.message);
  } else {
    throw new Error(`Admin biasa seharusnya ditolak 403, tapi menerima HTTP ${resAdminAccessLogs.status}`);
  }

  // 3c. Admin Utama mengakses /api/admins -> WAJIB 200 OK!
  const resUtamaAccessAdmins = await req('/admins', {
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resUtamaAccessAdmins.status === 200 && resUtamaAccessAdmins.data.success) {
    console.log(`✔ Admin Utama DIIZINKAN mengakses /api/admins (Jumlah admin: ${resUtamaAccessAdmins.data.data.length})`);
  } else {
    throw new Error(`Admin Utama gagal mengakses /api/admins: ${resUtamaAccessAdmins.status}`);
  }

  // 3d. Admin Utama mengakses /api/logs -> WAJIB 200 OK!
  const resUtamaAccessLogs = await req('/logs', {
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resUtamaAccessLogs.status === 200 && resUtamaAccessLogs.data.success) {
    console.log(`✔ Admin Utama DIIZINKAN mengakses /api/logs (Total log: ${resUtamaAccessLogs.data.pagination.total})`);
  } else {
    throw new Error(`Admin Utama gagal mengakses /api/logs: ${resUtamaAccessLogs.status}`);
  }

  // 4. Uji Manajemen Akun Admin oleh admin_utama (Create, Update, Toggle Status, Delete)
  console.log('\n4. Uji Operasi CRUD Akun Admin:');
  const tempUsername = `stg2_user_${Date.now()}`;
  
  // 4a. Buat Akun Baru
  const resCreateAdmin = await req('/admins', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenUtama}` },
    body: {
      username: tempUsername,
      password: 'testPassword123',
      nama_lengkap: 'Staff Operator Pengujian',
      peran: 'admin'
    }
  });
  if (resCreateAdmin.status !== 201) {
    throw new Error(`Gagal membuat akun admin baru: ${JSON.stringify(resCreateAdmin.data)}`);
  }
  const createdAdminId = resCreateAdmin.data.data.id;
  console.log(`✔ Tambah Admin berhasil (ID: ${createdAdminId}, Username: ${tempUsername})`);

  // 4b. Update Akun Admin
  const resUpdateAdmin = await req(`/admins/${createdAdminId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${tokenUtama}` },
    body: {
      nama_lengkap: 'Staff Operator Pengujian (Updated)',
      peran: 'admin'
    }
  });
  if (resUpdateAdmin.status !== 200) {
    throw new Error(`Gagal memperbarui akun: ${JSON.stringify(resUpdateAdmin.data)}`);
  }
  console.log('✔ Update Admin berhasil');

  // 4c. Toggle Status: Nonaktifkan Akun
  const resToggleOff = await req(`/admins/${createdAdminId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resToggleOff.status !== 200 || resToggleOff.data.data.aktif !== false) {
    throw new Error(`Gagal menonaktifkan akun: ${JSON.stringify(resToggleOff.data)}`);
  }
  console.log('✔ Penonaktifan Akun berhasil (aktif = false)');

  // 5. Uji Pengguna Nonaktif Ditolak Login
  console.log('\n5. Uji Login Akun Nonaktif:');
  const resLoginInactive = await req('/auth/login', {
    method: 'POST',
    body: { username: tempUsername, password: 'testPassword123' }
  });
  if (resLoginInactive.status === 403 && resLoginInactive.data.success === false) {
    console.log('✔ Akun nonaktif DITOLAK login dengan HTTP 403:', resLoginInactive.data.message);
  } else {
    throw new Error(`Ekspektasi 403 tapi menerima ${resLoginInactive.status}`);
  }

  // 4d. Toggle Status: Aktifkan Kembali Akun
  const resToggleOn = await req(`/admins/${createdAdminId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resToggleOn.status !== 200 || resToggleOn.data.data.aktif !== true) {
    throw new Error(`Gagal mengaktifkan kembali akun: ${JSON.stringify(resToggleOn.data)}`);
  }
  console.log('✔ Pengaktifan Kembali Akun berhasil (aktif = true)');

  // 4e. Coba Hapus Akun Diri Sendiri -> WAJIB 400 Ditolak!
  const resSelfDelete = await req('/admins/1', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resSelfDelete.status === 400) {
    console.log('✔ Upaya menghapus akun sendiri DITOLAK dengan HTTP 400:', resSelfDelete.data.message);
  } else {
    throw new Error(`Penghapusan akun sendiri seharusnya ditolak, tapi menerima status ${resSelfDelete.status}`);
  }

  // 4f. Coba Nonaktifkan Akun Diri Sendiri -> WAJIB 400 Ditolak!
  const resSelfDeactivate = await req('/admins/1/status', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resSelfDeactivate.status === 400) {
    console.log('✔ Upaya menonaktifkan akun sendiri DITOLAK dengan HTTP 400:', resSelfDeactivate.data.message);
  } else {
    throw new Error(`Penonaktifan akun sendiri seharusnya ditolak, tapi menerima status ${resSelfDeactivate.status}`);
  }

  // 4g. Hapus Akun Uji Sementara (karena tidak direferensikan)
  const resDeleteAdmin = await req(`/admins/${createdAdminId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resDeleteAdmin.status !== 200) {
    throw new Error(`Gagal menghapus akun uji: ${JSON.stringify(resDeleteAdmin.data)}`);
  }
  console.log('✔ Penghapusan akun uji sementara berhasil');

  // 6. Uji Proteksi Akun yang Memiliki Referensi Konten Beasiswa
  console.log('\n6. Uji Proteksi Relasional (Akun Tereferensi Beasiswa):');
  const refUsername = `ref_admin_${Date.now()}`;
  const resCreateRefAdmin = await req('/admins', {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenUtama}` },
    body: {
      username: refUsername,
      password: 'testPassword123',
      nama_lengkap: 'Admin Kontributor Beasiswa',
      peran: 'admin'
    }
  });
  const refAdminId = resCreateRefAdmin.data.data.id;

  // Sambungkan satu beasiswa uji yang dibuat_oleh refAdminId
  const [cats] = await pool.query('SELECT id FROM kategori_beasiswa LIMIT 1');
  const [provs] = await pool.query('SELECT id FROM penyelenggara_beasiswa LIMIT 1');
  const catId = cats[0].id;
  const provId = provs[0].id;

  const [bRes] = await pool.query(
    `INSERT INTO beasiswa (dibuat_oleh, kategori_id, penyelenggara_id, judul, slug, status_publikasi)
     VALUES (?, ?, ?, 'Beasiswa Uji Integritas', ?, 'draf')`,
    [refAdminId, catId, provId, `beasiswa-uji-integritas-${Date.now()}`]
  );
  const refBeasiswaId = bRes.insertId;

  // Upayakan DELETE pada refAdminId -> harus otomatis di-soft-deactivate, bukan error foreign key crash!
  const resDeleteRef = await req(`/admins/${refAdminId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenUtama}` }
  });
  if (resDeleteRef.status === 200) {
    console.log('✔ Akun yang mereferensikan konten beasiswa otomatis dinonaktifkan (bukan crash):', resDeleteRef.data.message);
  } else {
    throw new Error(`Gagal menangani akun dengan relasi beasiswa: ${resDeleteRef.status}`);
  }

  // Pastikan akun tersebut sekarang berstatus aktif = 0 di database
  const [userRow] = await pool.query('SELECT aktif FROM pengguna WHERE id = ?', [refAdminId]);
  if (userRow[0].aktif !== 0) {
    throw new Error('Akun seharusnya berstatus aktif = 0!');
  }
  console.log('✔ Terverifikasi di database: status akun otomatis diubah menjadi aktif = 0');

  // Bersihkan data uji integritas
  await pool.query('DELETE FROM beasiswa WHERE id = ?', [refBeasiswaId]);
  await pool.query('DELETE FROM pengguna WHERE id = ?', [refAdminId]);
  console.log('✔ Pembersihan data uji integritas selesai');

  console.log('\n=== SEMUA 10 SKENARIO UJI TAHAP 2 BERHASIL 100%! ===');
  await pool.end();
};

runStage2Tests().catch((err) => {
  console.error('\n❌ UJI TAHAP 2 GAGAL:', err.message);
  process.exit(1);
});
