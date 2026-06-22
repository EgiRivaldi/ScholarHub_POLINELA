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
  sanitizeString
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

  const lenErr = maxLength(nama_kategori, 100, 'nama_kategori');
  if (lenErr) errors.push(lenErr);

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateProvider = (req, res, next) => {
  const { nama_penyedia, singkatan, website, logo } = req.body;
  const errors = [];

  const reqErr = isRequired(nama_penyedia, 'nama_penyedia');
  if (reqErr) errors.push(reqErr);

  const lenErr = maxLength(nama_penyedia, 200, 'nama_penyedia');
  if (lenErr) errors.push(lenErr);

  if (singkatan) {
    const lenSing = maxLength(singkatan, 50, 'singkatan');
    if (lenSing) errors.push(lenSing);
  }

  if (website) {
    const urlErr = isValidURL(website);
    if (urlErr) errors.push(`Field 'website': ${urlErr}`);
    const lenWeb = maxLength(website, 255, 'website');
    if (lenWeb) errors.push(lenWeb);
  }

  if (logo) {
    const lenLogo = maxLength(logo, 255, 'logo');
    if (lenLogo) errors.push(lenLogo);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateScholarship = (req, res, next) => {
  const {
    nama_beasiswa,
    tanggal_buka,
    tanggal_tutup,
    url_pendaftaran,
    kategori_id,
    penyedia_id,
  } = req.body;
  const errors = [];

  // Required checks
  const fields = {
    nama_beasiswa,
    tanggal_buka,
    tanggal_tutup,
    url_pendaftaran,
    kategori_id,
    penyedia_id,
  };

  for (const [key, val] of Object.entries(fields)) {
    const reqErr = isRequired(val, key);
    if (reqErr) errors.push(reqErr);
  }

  // Length checks
  if (nama_beasiswa) {
    const lenErr = maxLength(nama_beasiswa, 255, 'nama_beasiswa');
    if (lenErr) errors.push(lenErr);
  }

  if (url_pendaftaran) {
    const urlErr = isValidURL(url_pendaftaran);
    if (urlErr) errors.push(`Field 'url_pendaftaran': ${urlErr}`);
    const lenUrl = maxLength(url_pendaftaran, 500, 'url_pendaftaran');
    if (lenUrl) errors.push(lenUrl);
  }

  // Date checks
  if (tanggal_buka) {
    const dateErr = isValidDate(tanggal_buka);
    if (dateErr) errors.push(`Field 'tanggal_buka': ${dateErr}`);
  }

  if (tanggal_tutup) {
    const dateErr = isValidDate(tanggal_tutup);
    if (dateErr) errors.push(`Field 'tanggal_tutup': ${dateErr}`);
  }

  // Date logical order check
  if (tanggal_buka && tanggal_tutup && !isValidDate(tanggal_buka) && !isValidDate(tanggal_tutup)) {
    if (new Date(tanggal_buka) > new Date(tanggal_tutup)) {
      errors.push("Field 'tanggal_buka' cannot be after 'tanggal_tutup'");
    }
  }

  // ID integer checks
  if (kategori_id) {
    const intErr = isInteger(kategori_id, 'kategori_id');
    if (intErr) errors.push(intErr);
  }

  if (penyedia_id) {
    const intErr = isInteger(penyedia_id, 'penyedia_id');
    if (intErr) errors.push(intErr);
  }

  if (errors.length > 0) {
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`).catch(err => {
        console.error('Failed to clean up uploaded file on validation error:', err);
      });
    }
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateRequirement = (req, res, next) => {
  const { beasiswa_id, ipk_minimum, semester_minimum } = req.body;
  const errors = [];

  const reqErr = isRequired(beasiswa_id, 'beasiswa_id');
  if (reqErr) errors.push(reqErr);

  if (beasiswa_id) {
    const intErr = isInteger(beasiswa_id, 'beasiswa_id');
    if (intErr) errors.push(intErr);
  }

  if (ipk_minimum !== undefined && ipk_minimum !== null && ipk_minimum !== '') {
    const ipkErr = isInRange(ipk_minimum, 0.00, 4.00, 'ipk_minimum');
    if (ipkErr) errors.push(ipkErr);
  }

  if (semester_minimum !== undefined && semester_minimum !== null && semester_minimum !== '') {
    const semErr = isInRange(semester_minimum, 1, 14, 'semester_minimum');
    if (semErr) errors.push(semErr);
    const intErr = isInteger(semester_minimum, 'semester_minimum');
    if (intErr) errors.push(intErr);
  }

  if (errors.length > 0) {
    return errorResponse(res, 'Validation failed', errors, 400);
  }
  next();
};

const validateAdmin = (req, res, next) => {
  const { username, password, nama_lengkap } = req.body;
  const errors = [];

  const reqUser = isRequired(username, 'username');
  if (reqUser) errors.push(reqUser);

  if (username) {
    const lenUserMin = minLength(username, 4, 'username');
    if (lenUserMin) errors.push(lenUserMin);
    const lenUserMax = maxLength(username, 50, 'username');
    if (lenUserMax) errors.push(lenUserMax);
  }

  if (req.method === 'POST') {
    const reqPass = isRequired(password, 'password');
    if (reqPass) errors.push(reqPass);
  }

  if (password) {
    const lenPass = minLength(password, 6, 'password');
    if (lenPass) errors.push(lenPass);
  }

  const reqNama = isRequired(nama_lengkap, 'nama_lengkap');
  if (reqNama) errors.push(reqNama);

  if (nama_lengkap) {
    const lenNama = maxLength(nama_lengkap, 100, 'nama_lengkap');
    if (lenNama) errors.push(lenNama);
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
