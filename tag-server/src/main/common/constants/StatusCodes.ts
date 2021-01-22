enum StatusCodes {
  OK = 200, // OK best used for READ and UPDATE
  CREATED = 201,
  NO_CONTENT = 204, // NOCONTENT best used for DELETE Operations
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

export default StatusCodes;
