const createAppError = (httpStatus, errMsg, next) => {
  const error = new Error(errMsg);
  error.statusCode = httpStatus;
  error.isOperational = true;
  return error;
};
const handleSuccessWithData = (res, data) => {
  res.send({
    status: 'success',
    data,
  });
};
const handleSuccessWithMsg = (res, message) => {
  res.send({
    status: 'success',
    message,
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
const handleErrorAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((error) => {
      return next(error);
    });
  };
};

module.exports = {
  createAppError,
  handleSuccessWithData,
  handleSuccessWithMsg,
  handleDevError,
  handleProdError,
  handleErrorAsync,
};
