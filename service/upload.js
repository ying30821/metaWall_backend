const multer = require('multer');
const path = require('path');
const { createAppError } = require('./handler');

const validateUploadImg = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
      return cb(
        createAppError(400, 'Only JPG, PNG and JPEG files are allowed.')
      );
    }
    cb(null, true);
  },
}).any();

module.exports = validateUploadImg;
