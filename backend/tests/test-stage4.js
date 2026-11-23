// Test Suite for Stage 4: Announcements, Site Settings, Activity Logs, and Roles
const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('--- STARTING STAGE 4 TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  };

  try {
    // 1. Public announcements endpoint
    console.log('\n--- 1. Testing Public Announcements ---');
    const pubAnnRes = await fetch(`${BASE_URL}/announcements/public`);
    const pubAnnJson = await pubAnnRes.json();
    assert(pubAnnRes.status === 200, 'Public announcements returns 200 OK');
    assert(pubAnnJson.success === true, 'Public announcements returns success: true');
    assert(Array.isArray(pubAnnJson.data), 'Public announcements data is an array');

    // 2. Authentication: Super Admin and Regular Admin
    console.log('\n--- 2. Authenticating Admin Accounts ---');
    const superLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin_utama', password: 'admin123' }),
    });
    const superLoginJson = await superLoginRes.json();
    const superToken = superLoginJson.data?.token;
    assert(superLoginRes.status === 200 && superToken, 'Super Admin (admin_utama) login succeeded');

    const regLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    const regLoginJson = await regLoginRes.json();
    const regToken = regLoginJson.data?.token;
    assert(regLoginRes.status === 200 && regToken, 'Regular Admin (admin) login succeeded');

    // 3. Announcements CRUD
    console.log('\n--- 3. Testing Announcements CRUD ---');
    // 3a. Invalid date validation (end < start)
    const invalidDateRes = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regToken}`,
      },
      body: JSON.stringify({
        judul: 'Test Invalid Date Announcement',
        isi_pengumuman: 'Testing date constraint validation',
        mulai_tayang: '2026-12-01T10:00',
        akhir_tayang: '2026-11-01T10:00', // Earlier than start
      }),
    });
    assert(invalidDateRes.status === 400, 'Creation with akhir_tayang < mulai_tayang correctly rejected with HTTP 400');

    // 3b. Create valid announcement
    const createAnnRes = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regToken}`,
      },
      body: JSON.stringify({
        judul: 'Pengumuman Uji Antigravity Tahap 4',
        isi_pengumuman: 'Ini adalah pengumuman uji otomatis untuk verifikasi sistem.',
        url_tujuan: 'https://polinela.ac.id',
        aktif: true,
        urutan_tampil: 99,
      }),
    });
    const createAnnJson = await createAnnRes.json();
    assert(createAnnRes.status === 201, 'Valid announcement created with HTTP 201');
    const createdAnnId = createAnnJson.data?.id;
    assert(createdAnnId !== undefined, `Created announcement ID: ${createdAnnId}`);

    // 3c. Get announcement by ID
    const getAnnRes = await fetch(`${BASE_URL}/announcements/${createdAnnId}`, {
      headers: { Authorization: `Bearer ${regToken}` },
    });
    const getAnnJson = await getAnnRes.json();
    assert(getAnnRes.status === 200, 'Get announcement by ID returns 200 OK');
    assert(getAnnJson.data?.judul === 'Pengumuman Uji Antigravity Tahap 4', 'Announcement data retrieved accurately');

    // 3d. Update announcement
    const updateAnnRes = await fetch(`${BASE_URL}/announcements/${createdAnnId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${regToken}`,
      },
      body: JSON.stringify({
        judul: 'Pengumuman Uji Antigravity Tahap 4 (Diperbarui)',
        urutan_tampil: 100,
      }),
    });
    const updateAnnJson = await updateAnnRes.json();
    assert(updateAnnRes.status === 200, 'Update announcement returns 200 OK');
    assert(updateAnnJson.data?.judul === 'Pengumuman Uji Antigravity Tahap 4 (Diperbarui)', 'Announcement updated accurately');

    // 3e. Delete announcement
    const delAnnRes = await fetch(`${BASE_URL}/announcements/${createdAnnId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${regToken}` },
    });
    assert(delAnnRes.status === 200, 'Delete announcement returns 200 OK');

    // 4. Site Settings (pengaturan_situs)
    console.log('\n--- 4. Testing Site Settings (pengaturan_situs) ---');
    // 4a. Public settings endpoint
    const pubSetRes = await fetch(`${BASE_URL}/settings/public`);
    const pubSetJson = await pubSetRes.json();
    assert(pubSetRes.status === 200, 'Public settings returns 200 OK');
    assert(pubSetJson.data?.nama_website !== undefined, 'Public settings contains nama_website');
    assert(typeof pubSetJson.data?.durasi_pengumuman_detik === 'number', 'durasi_pengumuman_detik parsed as number');
    assert(typeof pubSetJson.data?.pengumuman_bergerak_aktif === 'boolean', 'pengumuman_bergerak_aktif parsed as boolean');

    // 4b. Authorization: Regular admin rejected from settings
    const regSetRes = await fetch(`${BASE_URL}/settings`, {
      headers: { Authorization: `Bearer ${regToken}` },
    });
    assert(regSetRes.status === 403, 'Regular admin accessing /api/settings correctly blocked with HTTP 403 Forbidden');

    // 4c. Super admin can access and update settings
    const superSetRes = await fetch(`${BASE_URL}/settings`, {
      headers: { Authorization: `Bearer ${superToken}` },
    });
    const superSetJson = await superSetRes.json();
    assert(superSetRes.status === 200, 'Super admin accessing /api/settings returns 200 OK');
    assert(Array.isArray(superSetJson.data), 'Settings returned as full array to super admin');

    // 4d. Super admin bulk update settings
    const updateBulkRes = await fetch(`${BASE_URL}/settings/bulk`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${superToken}`,
      },
      body: JSON.stringify({
        settings: {
          teks_footer: 'Politeknik Negeri Lampung',
          durasi_pengumuman_detik: '20',
        },
      }),
    });
    assert(updateBulkRes.status === 200, 'Super admin bulk update settings returns 200 OK');

    // 5. Activity Logs (log_aktivitas)
    console.log('\n--- 5. Testing Activity Logs (log_aktivitas) ---');
    // 5a. Regular admin rejected from logs
    const regLogRes = await fetch(`${BASE_URL}/logs`, {
      headers: { Authorization: `Bearer ${regToken}` },
    });
    assert(regLogRes.status === 403, 'Regular admin accessing /api/logs correctly blocked with HTTP 403 Forbidden');

    // 5b. Super admin can read logs
    const superLogRes = await fetch(`${BASE_URL}/logs?limit=5`, {
      headers: { Authorization: `Bearer ${superToken}` },
    });
    const superLogJson = await superLogRes.json();
    assert(superLogRes.status === 200, 'Super admin accessing /api/logs returns 200 OK');
    assert(Array.isArray(superLogJson.data), 'Activity logs data is an array');
    assert(superLogJson.pagination?.total > 0, 'Total activity logs count > 0');

    // 5c. Security check: no secrets in logged data
    const hasSecretLeaked = superLogJson.data.some((log) => {
      const s1 = JSON.stringify(log.data_sebelum || {});
      const s2 = JSON.stringify(log.data_sesudah || {});
      return s1.includes('hash_kata_sandi') || s2.includes('hash_kata_sandi') || s1.includes('token') || s2.includes('token');
    });
    assert(!hasSecretLeaked, 'Security Verified: No password hashes or auth tokens leaked in activity logs');

    console.log(`\n========================================`);
    console.log(`STAGE 4 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
};

runTests();
