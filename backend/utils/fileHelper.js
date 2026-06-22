const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

const deleteImageFile = async (imagePath) => {
  if (!imagePath) return;
  try {
    const filename = path.basename(imagePath);
    const fullPath = path.join(UPLOADS_DIR, filename);

    // Secure validation: check if the resolved path starts with the absolute directory path
    if (!fullPath.startsWith(UPLOADS_DIR)) {
      console.error(`Security alert: Attempted path traversal blocked for ${imagePath}`);
      return;
    }

    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
      await fs.promises.unlink(fullPath);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Failed to delete file: ${fullPath}`, err);
      }
    }
  } catch (err) {
    console.error(`Error resolving file deletion for ${imagePath}:`, err);
  }
};

module.exports = {
  deleteImageFile,
  UPLOADS_DIR,
};
