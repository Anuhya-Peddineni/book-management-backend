const bunyan = require('bunyan');

const logLevel = process.env.logLevel || 'debug';
const logger = bunyan.createLogger({ name: 'books-api', level: logLevel });

module.exports = logger;
