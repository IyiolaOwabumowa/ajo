const endpointsConfig = {
  mongoUri: process.env.MONGO_URI ?? '',
  port: process.env.PORT ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
};

export default endpointsConfig;
