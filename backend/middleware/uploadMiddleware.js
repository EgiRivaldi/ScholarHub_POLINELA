const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = crypto.randomUUID();
    cb(null, `${uniqueName}${ext}`);
  },
});

// Configure file filter
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (allowedMimeTypes.includes(mime) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WEBP images are allowed'), false);
  }
};

// Size limit from env (default 5MB)
const limits = {
  fileSize: parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 5242880,
};

const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
