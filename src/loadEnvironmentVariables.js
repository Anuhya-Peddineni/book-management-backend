const env = process.env.NODE_ENV || 'local';
const deployConfig = require(`./config/${env}_deploy_config.json`);

process.env.ServerPort = deployConfig.ServerPort;
process.env.MongoDbUrl = deployConfig.MongoDbUrl;
process.env.loglevel = deployConfig.LogLevel;
