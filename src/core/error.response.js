/* eslint-disable max-classes-per-file */
const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZE: 401,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
};

const ReasonStatusCode = {
  FORBIDDEN: 'Bad request message',
  CONFLICT: 'Conflict error',
  UNAUTHORIZE: 'Unauthorized',
  NOT_FOUND: ' Not found',
  BAD_REQUEST: 'Bad request',
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT,
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    status = StatusCode.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.UNAUTHORIZE,
    status = StatusCode.UNAUTHORIZE,
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    status = StatusCode.NOT_FOUND,
  ) {
    super(message, status);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
  ErrorResponse,
};
