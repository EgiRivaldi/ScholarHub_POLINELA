const app = require('./app');
const { testConnection } = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  logger.info('Initializing ScholarHub POLINELA backend...');

  // Test database connection before launching server
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('Database connection failed. Exiting process.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`API base URL: http://localhost:${PORT}/api`);
  });
};

startServer();
