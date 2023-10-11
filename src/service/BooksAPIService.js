const BooksAPIRepository = require('../repository/BookAPIRepository');
const CustomError = require('../common/ErrorHandler');

module.exports = class BookAPIService {
  constructor(logger) {
    this.logger = logger;
    this.booksAPIRepository = new BooksAPIRepository(logger);
  }

  async createBook(bookDetail) {
    try {
      this.logger.debug('createBook function in service layer invoked', { bookDetail });
      const createdBook = await this.booksAPIRepository.createBook(bookDetail);
      this.logger.debug('createBook function execution in service layer succeeded');
      return createdBook;
    } catch (error) {
      this.logger.error('createBook function in service layer resulted in error', { error });
      throw error;
    }
  }

  async readBook(queryParams) {
    try {
      this.logger.debug('readBook function in service layer invoked');
      const retrievedBooks = await this.booksAPIRepository.getBook(queryParams);
      this.logger.debug('readBook function execution in service layer succeeded', { retrievedBooks });
      return retrievedBooks;
    } catch (error) {
      this.logger.error('readBook function in service layer resulted in error', { error });
      throw error;
    }
  }

  async readBookById(bookId) {
    try {
      this.logger.debug('readBookById function in service layer invoked', { bookId });
      const retrievedBook = await this.booksAPIRepository.getBookById(bookId);
      this.logger.debug('readBookById function execution in service layer succeeded', { retrievedBook });
      if (retrievedBook === null) {
        throw new CustomError('Not Found', 'Book with provided id does not exist', 404);
      }
      return retrievedBook;
    } catch (error) {
      this.logger.error('readBookById function in service layer resulted in error', { error });
      throw error;
    }
  }

  async updateBookById(updatedBookDetail, bookId) {
    try {
      this.logger.debug('updateBookById function in service layer invoked', { updatedBookDetail, bookId }, { new: true });
      const updatedBook = await this.booksAPIRepository.updateBookById(updatedBookDetail, bookId);
      if (updatedBook === null) {
        throw new CustomError('Not Found', 'Book does not exist', 404);
      }
      this.logger.debug('updateBookById function execution in service layer succeeded');
      return updatedBook;
    } catch (error) {
      this.logger.error('updateBookById function in service layer resulted in error', { error });
      throw error;
    }
  }

  async deleteBookById(bookId) {
    try {
      this.logger.debug('deleteBookById function in service layer invoked', { bookId });
      const deletedBook = await this.booksAPIRepository.deleteBookById(bookId);
      this.logger.debug('deleteBookById function execution in service layer succeeded', { deletedBook });
      if (deletedBook === null) {
        throw new CustomError('Not Found', 'Book with provided id does not exist', 404);
      }
      return deletedBook;
    } catch (error) {
      this.logger.error('deleteBookById function in service layer resulted in error', { error });
      throw error;
    }
  }
};
