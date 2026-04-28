const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const sequelize = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorHandler');

require('./models/User');
require('./models/Task');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

//  Security
app.use(helmet());

//  FIXED CORS (very important)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

//  Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  ROOT ROUTE (so "/" doesn't show error)
app.get('/', (req, res) => {
  res.send('🚀 TaskFlow API is running');
});

//  Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

//  Error handlers
app.use(notFound);
app.use(errorHandler);

//  Start server
const startServer = async () => {
  try {
    console.log(" Connecting to DB...");

    await sequelize.authenticate();
    console.log(' Database connected successfully');

    await sequelize.sync();
    console.log(' Database synced (tables created)');

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();