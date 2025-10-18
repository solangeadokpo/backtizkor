export default () => ({
  api: {
    globalPrefix: process.env.API_GLOBAL_PREFIX || "api",
    rateLimit: {
      max: parseInt(process.env.API_RATE_LIMIT_MAX ?? "100", 10),
      windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS ?? "60000", 10),
    },
    cors: {
      enabled: process.env.API_CORS_ENABLED === "true",
      origin: process.env.API_CORS_ORIGIN || "*",
    },
    pagination: {
      defaultLimit: parseInt(
        process.env.API_PAGINATION_DEFAULT_LIMIT ?? "10",
        10,
      ),
      maxLimit: parseInt(process.env.API_PAGINATION_MAX_LIMIT ?? "100", 10),
    },
    jwt: {
      secret: process.env.JWT_SECRET || "default_secret",
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  },
});
