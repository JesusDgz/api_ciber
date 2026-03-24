const jwt = require('jsonwebtoken');

const appConfig = require('../config/appConfig');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token requerido en el header Authorization',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalido o expirado',
    });
  }
}

module.exports = verifyToken;
