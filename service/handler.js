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

module.exports = { handleSuccess, handleError };
