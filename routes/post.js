const express = require('express');
const PostControllers = require('../controllers/post');
const { handleErrorAsync } = require('../service/handler');
const router = express.Router();

router.post('/', handleErrorAsync(PostControllers.createPost));
router.delete('/:id', handleErrorAsync(PostControllers.deletePost));
router.patch('/:id', handleErrorAsync(PostControllers.editPost));

module.exports = router;
