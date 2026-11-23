const mysql = require('mysql2/promise');
const logger = require('../utils/logger');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'beasiswa_polinela',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  dateStrings: true,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1 + 1 AS result');
    connection.release();
    logger.info(`MySQL connected successfully to database: ${process.env.DB_NAME || 'beasiswa_polinela'}`);
    return true;
  } catch (error) {
    logger.error(`MySQL connection failed: ${error.message}`);
    return false;
  }
};

module.exports = {
  pool,
  db: pool,
  testConnection,
};
