export default () => ({
  database: {
    mongo: {
      username: process.env.MONGO_USERNAME || "root",
      password: process.env.MONGO_PASSWORD || "password",
      host: process.env.MONGO_HOST || "localhost",
      port: parseInt(process.env.MONGO_PORT ?? "27017") || 27017,
      database: process.env.MONGO_DATABASE || "mydatabase",
    },
  },
});
