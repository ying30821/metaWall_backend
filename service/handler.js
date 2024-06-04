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
const handleGlobalError = (err, req, res, next) => {
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
  handleGlobalError,
  handleErrorAsync,
};
