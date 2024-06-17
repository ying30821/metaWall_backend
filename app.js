const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
const usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');
require('./connections');
const {
  handleUnexpectedError,
  handleGlobalError,
  createAppError,
} = require('./service/handler');

const app = express();

handleUnexpectedError();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/post', postRouter);
app.use('/api/upload', uploadRouter);

app.use((req, res, next) => {
  next(createAppError(404, 'Route Not Found'));
});
app.use(handleGlobalError);
module.exports = app;
