const express = require('express');
const cors = require('cors');

const appConfig = require('./config/appConfig');
const authRoutes = require('./routes/authRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: appConfig.corsOrigin }));
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedSec-IoT API operativa',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', authRoutes);
app.use('/', hospitalRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(appConfig.port, () => {
  console.log(`MedSec-IoT API escuchando en http://localhost:${appConfig.port}`);
});
