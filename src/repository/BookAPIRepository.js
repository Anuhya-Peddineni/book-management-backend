const BookDBSchema = require('./schema/BookSchema');

module.exports = class BookAPIRepository {
  constructor(logger) {
    this.logger = logger;
    this.projection = { __v: false };
  }

  async createBook(bookToBeInserted) {
    try {
      this.logger.debug('Upsert book function invoked from repository', { bookToBeInserted });
      const item = new BookDBSchema(bookToBeInserted);
      const insertedItem = await item.save();
      this.logger.debug('Upsert book to DB succeeded', { insertedItem });
      bookToBeInserted._id = insertedItem._id;
      return bookToBeInserted;
    } catch (error) {
      this.logger.error('Error occurred while inserting book into DB', { error });
      throw error;
    }
  }

  async getBook(queryParams) {
    try {
      this.logger.debug('getBook function invoked from repository', { queryParams });
      const retrievedBooks = await BookDBSchema.find(queryParams, this.projection);
      this.logger.debug('Get book from DB succeeded', { retrievedBooks });
      return retrievedBooks;
    } catch (error) {
      this.logger.error('Error occurred while retrieving book from DB', { error });
      throw error;
    }
  }

  async getBookById(bookId) {
    try {
      this.logger.debug('getBook function invoked from repository', { bookId });
      const retrievedBook = await BookDBSchema.findById(bookId, this.projection);
      this.logger.debug('Get book by id from DB succeeded', { retrievedBook });
      return retrievedBook;
    } catch (error) {
      this.logger.error('Error occurred while retrieving book by id from DB', { error });
      throw error;
    }
  }

  async updateBookById(bookToBeUpdated, bookId) {
    try {
      this.logger.debug('Update book function invoked from repository', { bookToBeUpdated, bookId });
      const updatedBook = await BookDBSchema.findByIdAndUpdate(
        bookId,
        { $set: { genre: bookToBeUpdated.genre } },
        { new: true, projection: this.projection },
      );
      this.logger.debug('Update book in DB succeeded', { updatedBook });
      return updatedBook;
    } catch (error) {
      this.logger.error('Error occurred while updating book in DB', { error });
      throw error;
    }
  }

  async deleteBookById(bookId) {
    try {
      this.logger.debug('deleteBookById function invoked from repository', { bookId });
      const deletedBook = await BookDBSchema.findByIdAndDelete(bookId);
      this.logger.debug('Delete book in DB succeeded', { deletedBook });
      return deletedBook;
    } catch (error) {
      this.logger.error('Error occurred while deleting book from DB', { error });
      throw error;
    }
  }
};
