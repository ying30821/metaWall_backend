const express = require('express');
const PostControllers = require('../controllers/post');

const router = express.Router();

router.post('/', PostControllers.createPost);
router.delete('/:id', PostControllers.deletePost);
router.patch('/:id', PostControllers.editPost);

module.exports = router;
