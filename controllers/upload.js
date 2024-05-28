const { v4: uuidv4 } = require('uuid');
const firebaseAdmin = require('../connections/firebase');
const bucket = firebaseAdmin.storage().bucket();
const { handleSuccessWithData, createAppError } = require('../service/handler');

const upload = {
  async uploadImage(req, res, next) {
    if (!req.files.length) return next(createAppError(400, 'No file uploaded'));
    const file = req.files[0];
    const blob = bucket.file(
      `images/${uuidv4()}.${file.originalname.split('.').pop()}`
    );
    const blobStream = blob.createWriteStream();
    blobStream.end(file.buffer);
    blobStream.on('finish', () => {
      const config = {
        action: 'read',
        expires: '12-31-2500',
      };
      blob.getSignedUrl(config, (err, fileUrl) => {
        handleSuccessWithData(res, fileUrl);
      });
      blobStream.on('error', (err) => {
        return next(createAppError(500, 'Image upload failed'));
      });
    });
  },
};

module.exports = upload;
