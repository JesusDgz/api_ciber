function getVitals(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      paciente: 'Paciente Demo',
      frecuencia_cardiaca: 78,
      oxigeno: 97,
    },
    requestedBy: req.user.role,
  });
}

function updateDose(req, res) {
  const { paciente, medicamento, dosis } = req.body;

  if (!paciente || !medicamento || typeof dosis !== 'number') {
    return res.status(400).json({
      success: false,
      message: 'paciente, medicamento y dosis numerica son obligatorios',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Dosis actualizada correctamente',
    data: {
      paciente,
      medicamento,
      dosis,
      updatedBy: req.user.role,
      timestamp: new Date().toISOString(),
    },
  });
}

function receiveMqttData(req, res) {
  console.log('MQTT IoT payload recibido:', {
    source: req.ip,
    payload: req.body,
    timestamp: new Date().toISOString(),
  });

  return res.status(202).json({
    success: true,
    message: 'Datos IoT recibidos y registrados',
  });
}

module.exports = {
  getVitals,
  updateDose,
  receiveMqttData,
};
