module.exports = class CustomError extends Error {
  constructor(errorType, message, httpStatus) {
    super(message);
    this.errorType = errorType;
    this.httpStatus = httpStatus;
  }
};
