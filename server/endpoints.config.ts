const endpointsConfig = {
  mongoUri: process.env.MONGO_URI ?? '',
  port: process.env.PORT ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  smtpHost: process.env.SMTP_HOST ?? '',
  smtpPort: process.env.SMTP_PORT ?? '',
  smtpService: process.env.SMTP_SERVICE ?? '',
  smtpUsername: process.env.SMTP_USERNAME ?? '',
  smtpPassword: process.env.SMTP_PASSWORD ?? '',
  nodeEnv: process.env.NODE_ENV ?? '',
  flutterwaveSecret:  process.env.FLUTTERWAVE_SECRET ?? '',
  flutterwavePublic: process.env.FLUTTERWAVE_PUBLIC ?? '',             
  paystackSecret: process.env.PAYSTACK_SECRET ?? ''
};

export default endpointsConfig;
