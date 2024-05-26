const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../service/handler');
const { checkAuth } = require('../service/auth');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));
router.patch(
  '/update_password',
  checkAuth,
  handleErrorAsync(UsersControllers.updatePassword)
);

module.exports = router;
