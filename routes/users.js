const express = require('express');
const router = express.Router();
const UsersControllers = require('../controllers/users');
const { handleErrorAsync } = require('../service/handler');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));

module.exports = router;
