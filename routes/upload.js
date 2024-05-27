const express = require('express');
const router = express.Router();
const UploadControllers = require('../controllers/upload');
const { handleErrorAsync } = require('../service/handler');
const { checkAuth } = require('../service/auth');
const validateUploadImg = require('../service/upload');

router.post(
  '/',
  checkAuth,
  validateUploadImg,
  handleErrorAsync(UploadControllers.uploadImage)
);

module.exports = router;
