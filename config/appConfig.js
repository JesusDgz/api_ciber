module.exports = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'medsec-iot-default-secret-change-me',
  jwtExpiresIn: '1h',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
