const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const postsRouter = require('./routes/posts');
const postRouter = require('./routes/post');
require('./connections');
const {
  createAppError,
  handleDevError,
  handleProdError,
} = require('./service/handler');

const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception！');
  console.error(err);
  process.exit(1);
});
process.on('unhandledRejection', (err, promise) => {
  console.error('Uncaught rejection:', promise, 'reason:', err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/posts', postsRouter);
app.use('/api/post', postRouter);

app.use((req, res, next) => {
  res.status(404).send('Route Not Found');
});
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return handleDevError(err, res);
  }
  if (err.name === 'ValidationError') {
    const newError = createAppError(
      400,
      'Validation Failed: One or more fields contain invalid data.'
    );
    return handleProdError(newError, res);
  } else if (err.name === 'CastError') {
    const newError = createAppError(
      400,
      'Invalid data type: Unable to convert value to expected type.'
    );
    return handleProdError(newError, res);
  } else if (err.name === 'StrictModeError') {
    const newError = createAppError(
      400,
      'Invalid operation: Trying to modify undeclared variable.'
    );
    return handleProdError(newError, res);
  } else if (err.name === 'SyntaxError') {
    const newError = createAppError(
      400,
      'Syntax Error: Unable to parse request.'
    );
    return handleProdError(newError, res);
  }
  handleProdError(err, res);
});
module.exports = app;
