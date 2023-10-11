const express = require('express');
const mongoose = require('mongoose');
const logger = require('./common/Logger');

const port = process.env.ServerPort || 3000;
const mongoDbUrl = process.env.MongoDbUrl || 'mongodb://127.0.0.1:27017/books';

const booksAPIRoutes = require('./controller/BooksAPIRoutesController');

mongoose.connect(mongoDbUrl, { useNewUrlParser: true });
const { connection } = mongoose;
connection.on('open', () => {
  logger.debug('Connection to DB established successfully');
});

const app = express();
app.use(express.json());
app.use('/books', booksAPIRoutes);
app.listen(port, () => logger.debug(`Server listening on PORT: http://localhost:${port}`));

module.exports = {
  logger,
};
