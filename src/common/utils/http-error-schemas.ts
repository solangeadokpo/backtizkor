export const badRequestErrorSchema = {
  schema: {
    example: {
      status_code: 400,
      timestamp: new Date().toISOString(),
      message: "Bad Request",
      error: {
        code: "VALIDATION_ERROR",
        details: "Phone number is required",
      },
    },
  },
};

export const unauthorizedErrorSchema = {
  schema: {
    example: {
      status_code: 401,
      timestamp: new Date().toISOString(),
      message: "Unauthorized",
      error: {
        code: "UNAUTHORIZED",
        details: "Authentication is required or has failed",
      },
    },
  },
};

export const forbiddenErrorScheema = {
  schema: {
    example: {
      status_code: 403,
      timestamp: new Date().toISOString(),
      message: "Forbidden",
      error: {
        code: "FORBIDDEN",
        details: "Authentication is required or has failed",
      },
    },
  },
};

export const notFoundErrorSchema = {
  schema: {
    example: {
      status_code: 404,
      timestamp: new Date().toISOString(),
      message: "Not Found",
      error: {
        code: "NOT_FOUND",
        details: "The requested resource was not found",
      },
    },
  },
};

export const conflictErrorSchema = {
  schema: {
    example: {
      status_code: 409,
      timestamp: new Date().toISOString(),
      message: "Conflict",
      error: {
        code: "CONFLICT",
        details: "Resource conflict occurred",
      },
    },
  },
};

export const internalServerErrorSchema = {
  schema: {
    example: {
      status_code: 500,
      timestamp: new Date().toISOString(),
      message: "Internal Server Error",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred",
      },
    },
  },
};
