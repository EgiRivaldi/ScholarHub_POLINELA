const { errorResponse } = require('../utils/responseHelper');
const { deleteImageFile } = require('../utils/fileHelper');
const {
  isRequired,
  isValidURL,
  isValidDate,
  isInRange,
  minLength,
  maxLength,
  isInteger,
  sanitizeString,
} = require('../utils/validators');

// Helper to sanitize request body strings
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    }
  }
  next();
};

const validateCategory = (req, res, next) => {
  const { nama_kategori } = req.body;
  const errors = [];

  const reqErr = isRequired(nama_kategori, 'nama_kategori');
  if (reqErr) errors.push(reqErr);

  const lenErr = maxLength(nama_kategori, 120, 'nama_kategori');
  if (lenErr) errors.push(lenErr);

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateProvider = (req, res, next) => {
  const { nama_penyelenggara, nama_penyedia, url_website, website, email_kontak, kontak, logo } = req.body;
  const errors = [];

  const finalName = nama_penyelenggara || nama_penyedia;
  const reqErr = isRequired(finalName, 'nama_penyelenggara');
  if (reqErr) errors.push(reqErr);

  const lenErr = maxLength(finalName, 180, 'nama_penyelenggara');
  if (lenErr) errors.push(lenErr);

  const finalWebsite = url_website || website;
  if (finalWebsite) {
    const urlErr = isValidURL(finalWebsite);
    if (urlErr) errors.push(`Field 'url_website': ${urlErr}`);
    const lenWeb = maxLength(finalWebsite, 2048, 'url_website');
    if (lenWeb) errors.push(lenWeb);
  }

  const finalEmail = email_kontak || kontak;
  if (finalEmail) {
    const lenEmail = maxLength(finalEmail, 254, 'email_kontak');
    if (lenEmail) errors.push(lenEmail);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateScholarship = (req, res, next) => {
  const {
    judul,
    nama_beasiswa,
    tanggal_buka,
    tanggal_tutup,
    url_pendaftaran,
    url_sumber_resmi,
    kategori_id,
    penyelenggara_id,
    penyedia_id,
    status_publikasi,
  } = req.body;
  const errors = [];

  const finalJudul = judul || nama_beasiswa;
  const finalPenyelenggaraId = penyelenggara_id || penyedia_id;

  // Required checks on POST
  if (req.method === 'POST') {
    const reqJudul = isRequired(finalJudul, 'judul');
    if (reqJudul) errors.push(reqJudul);

    const reqKat = isRequired(kategori_id, 'kategori_id');
    if (reqKat) errors.push(reqKat);

    const reqPeny = isRequired(finalPenyelenggaraId, 'penyelenggara_id');
    if (reqPeny) errors.push(reqPeny);
  }

  // Length checks
  if (finalJudul) {
    const lenErr = maxLength(finalJudul, 255, 'judul');
    if (lenErr) errors.push(lenErr);
  }

  if (url_pendaftaran) {
    const urlErr = isValidURL(url_pendaftaran);
    if (urlErr) errors.push(`Field 'url_pendaftaran': ${urlErr}`);
    const lenUrl = maxLength(url_pendaftaran, 2048, 'url_pendaftaran');
    if (lenUrl) errors.push(lenUrl);
  }

  if (url_sumber_resmi) {
    const urlErr = isValidURL(url_sumber_resmi);
    if (urlErr) errors.push(`Field 'url_sumber_resmi': ${urlErr}`);
    const lenUrl = maxLength(url_sumber_resmi, 2048, 'url_sumber_resmi');
    if (lenUrl) errors.push(lenUrl);
  }

  // Date checks (can be null/empty or YYYY-MM-DD)
  if (tanggal_buka && tanggal_buka.trim() !== '') {
    const dateErr = isValidDate(tanggal_buka.substring(0, 10));
    if (dateErr) errors.push(`Field 'tanggal_buka': ${dateErr}`);
  }

  if (tanggal_tutup && tanggal_tutup.trim() !== '') {
    const dateErr = isValidDate(tanggal_tutup.substring(0, 10));
    if (dateErr) errors.push(`Field 'tanggal_tutup': ${dateErr}`);
  }

  // Date logical order check
  if (tanggal_buka && tanggal_tutup && tanggal_buka.trim() !== '' && tanggal_tutup.trim() !== '') {
    if (new Date(tanggal_buka) > new Date(tanggal_tutup)) {
      errors.push("Field 'tanggal_buka' tidak boleh lebih dari 'tanggal_tutup'");
    }
  }

  // Integer checks
  if (kategori_id) {
    const intErr = isInteger(kategori_id, 'kategori_id');
    if (intErr) errors.push(intErr);
  }

  if (finalPenyelenggaraId) {
    const intErr = isInteger(finalPenyelenggaraId, 'penyelenggara_id');
    if (intErr) errors.push(intErr);
  }

  if (status_publikasi && !['draf', 'terbit', 'arsip'].includes(status_publikasi)) {
    errors.push("Field 'status_publikasi' harus berupa 'draf', 'terbit', atau 'arsip'");
  }

  if (errors.length > 0) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`).catch((err) => {
        console.error('Failed to clean up uploaded file on validation error:', err);
      });
    }
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateRequirement = (req, res, next) => {
  const { beasiswa_id, nama_persyaratan, dokumen_persyaratan, jenis_persyaratan, urutan_tampil } = req.body;
  const errors = [];

  const finalNama = nama_persyaratan || dokumen_persyaratan;

  if (req.method === 'POST') {
    const reqBeasiswa = isRequired(beasiswa_id, 'beasiswa_id');
    if (reqBeasiswa) errors.push(reqBeasiswa);

    const reqNama = isRequired(finalNama, 'nama_persyaratan');
    if (reqNama) errors.push(reqNama);
  }

  if (beasiswa_id) {
    const intErr = isInteger(beasiswa_id, 'beasiswa_id');
    if (intErr) errors.push(intErr);
  }

  if (jenis_persyaratan && !['umum', 'akademik', 'administrasi', 'lainnya'].includes(jenis_persyaratan)) {
    errors.push("Field 'jenis_persyaratan' harus berupa 'umum', 'akademik', 'administrasi', atau 'lainnya'");
  }

  if (urutan_tampil !== undefined && urutan_tampil !== null && urutan_tampil !== '') {
    const intErr = isInteger(urutan_tampil, 'urutan_tampil');
    if (intErr) errors.push(intErr);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateAdmin = (req, res, next) => {
  const { username, nama_pengguna, password, nama_lengkap, peran, role } = req.body;
  const errors = [];
  const finalUsername = nama_pengguna || username;

  if (req.method === 'POST') {
    const reqUser = isRequired(finalUsername, 'username');
    if (reqUser) errors.push(reqUser);

    const reqPass = isRequired(password, 'password');
    if (reqPass) errors.push(reqPass);

    const reqNama = isRequired(nama_lengkap, 'nama_lengkap');
    if (reqNama) errors.push(reqNama);
  }

  if (finalUsername) {
    const lenUserMin = minLength(finalUsername, 3, 'username');
    if (lenUserMin) errors.push(lenUserMin);
    const lenUserMax = maxLength(finalUsername, 80, 'username');
    if (lenUserMax) errors.push(lenUserMax);
  }

  if (password) {
    const lenPass = minLength(password, 6, 'password');
    if (lenPass) errors.push(lenPass);
  }

  if (nama_lengkap) {
    const lenNama = maxLength(nama_lengkap, 150, 'nama_lengkap');
    if (lenNama) errors.push(lenNama);
  }

  const finalRole = peran || role;
  if (finalRole && !['admin', 'admin_utama'].includes(finalRole)) {
    errors.push("Field 'peran' must be either 'admin' or 'admin_utama'");
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

module.exports = {
  sanitizeBody,
  validateCategory,
  validateProvider,
  validateScholarship,
  validateRequirement,
  validateAdmin,
};
