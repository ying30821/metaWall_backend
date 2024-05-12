const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
require('./connections');

const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception！');
  console.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (err, promise) => {
  console.error('Uncaught rejection:', promise, 'reason:', 'err');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/post', postRouter);

app.use((req, res, next) => {
  res.status(404).send('Route Not Found');
});
module.exports = app;
