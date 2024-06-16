const transformId = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
};

module.exports = { transformId };
