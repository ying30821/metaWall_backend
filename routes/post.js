const express = require('express');
const PostControllers = require('../controllers/post');
const { handleErrorAsync } = require('../service/handler');
const { checkAuth } = require('../service/auth');

const router = express.Router();

router.get('/:id', checkAuth, handleErrorAsync(PostControllers.getPost));
router.post('/', checkAuth, handleErrorAsync(PostControllers.createPost));
router.delete('/:id', checkAuth, handleErrorAsync(PostControllers.deletePost));
router.patch('/:id', checkAuth, handleErrorAsync(PostControllers.editPost));
router.post(
  '/:id/comment',
  checkAuth,
  handleErrorAsync(PostControllers.createPostComment)
);
router.patch(
  '/comment/:id',
  checkAuth,
  handleErrorAsync(PostControllers.editPostComment)
);
router.delete(
  '/comment/:id',
  checkAuth,
  handleErrorAsync(PostControllers.deletePostComment)
);
router.post(
  '/:id/like',
  checkAuth,
  handleErrorAsync(PostControllers.addPostLike)
);
router.delete(
  '/:id/like',
  checkAuth,
  handleErrorAsync(PostControllers.deletePostLike)
);

module.exports = router;
