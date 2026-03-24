function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
  });
}

function errorHandler(error, req, res, next) {
  console.error('Error no controlado:', error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
