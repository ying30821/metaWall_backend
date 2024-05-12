const express = require('express');
const PostsControllers = require('../controllers/posts');

const router = express.Router();

router.get('/', PostsControllers.getPosts);
router.delete('/', PostsControllers.deletePosts);

module.exports = router;
