const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const appConfig = require('../config/appConfig');
const users = require('../config/users');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'username y password son obligatorios',
      });
    }

    const user = users.find((item) => item.username === username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas',
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      appConfig.jwtSecret,
      { expiresIn: appConfig.jwtExpiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Autenticacion exitosa',
      token,
      expiresIn: appConfig.jwtExpiresIn,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
