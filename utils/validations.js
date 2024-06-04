const REGEX = {
  password: /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/,
};

const isValidPassword = (pwd) => {
  return REGEX.password.test(pwd);
};

module.exports = { isValidPassword };
