const createAppError = (httpStatus, errMsg, next) => {
  const error = new Error(errMsg);
  error.statusCode = httpStatus;
  error.isOperational = true;
  return error;
};
const handleSuccess = (res, data) => {
  res.send({
    status: 'success',
    data,
  });
};
const handleDevError = (err, res) => {
  res.status(err.statusCode).send({
    status: 'failed',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const handleProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: 'failed',
      message: err.message,
    });
  } else {
    console.error('Fatal', err);
    res.status(500).send({
      status: 'failed',
      message: 'Internal Server Error',
    });
  }
};

module.exports = {
  createAppError,
  handleSuccess,
  handleDevError,
  handleProdError,
};
