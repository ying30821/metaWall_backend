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
router.get(
  '/profile',
  checkAuth,
  handleErrorAsync(UsersControllers.getProfile)
);
router.patch(
  '/profile',
  checkAuth,
  handleErrorAsync(UsersControllers.editProfile)
);
router.post(
  '/:id/follow',
  checkAuth,
  handleErrorAsync(UsersControllers.followUser)
);
router.delete(
  '/:id/unfollow',
  checkAuth,
  handleErrorAsync(UsersControllers.unfollowUser)
);
router.get(
  '/followings',
  checkAuth,
  handleErrorAsync(UsersControllers.getFollowings)
);

module.exports = router;
