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
const handleError = (res, httpStatus, message) => {
  res.status(httpStatus).send({
    status: 'failed',
    message,
  });
};

module.exports = { createAppError, handleSuccess, handleError };
