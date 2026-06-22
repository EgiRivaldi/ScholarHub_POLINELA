const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

logger.info('Env keys check: ' + Object.keys(process.env).filter(k => k.startsWith('DB_') || k === 'NODE_ENV' || k === 'PORT').join(', '));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'scholarhub_polinela',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query('SELECT 1');
    connection.release();
    logger.info('Database connected successfully');
    return true;
  } catch (error) {
    logger.error(`Database connection failed: ${error.stack || error.message || error}`);
    return false;
  }
};

module.exports = { pool, testConnection };
