const express = require('express');
const PostsControllers = require('../controllers/posts');
const { checkAuth } = require('../service/auth');

const router = express.Router();

router.get('/', checkAuth, PostsControllers.getPosts);
router.delete('/', checkAuth, PostsControllers.deletePosts);

module.exports = router;
