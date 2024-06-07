const express = require('express');
const PostControllers = require('../controllers/post');
const { handleErrorAsync } = require('../service/handler');
const { checkAuth } = require('../service/auth');

const router = express.Router();

router.post('/', checkAuth, handleErrorAsync(PostControllers.createPost));
router.delete('/:id', checkAuth, handleErrorAsync(PostControllers.deletePost));
router.patch('/:id', checkAuth, handleErrorAsync(PostControllers.editPost));
router.post(
  '/:id/comment',
  checkAuth,
  handleErrorAsync(PostControllers.createPostComment)
);
router.post('/:id/like', checkAuth, handleErrorAsync(PostControllers.likePost));
router.delete(
  '/:id/unlike',
  checkAuth,
  handleErrorAsync(PostControllers.unlikePost)
);

module.exports = router;
