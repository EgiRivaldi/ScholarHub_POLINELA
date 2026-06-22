const getTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

const logger = {
  info: (message) => {
    console.log(`[INFO]  [${getTimestamp()}] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] [${getTimestamp()}] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN]  [${getTimestamp()}] ${message}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEBUG] [${getTimestamp()}] ${message}`);
    }
  },
};

module.exports = logger;
