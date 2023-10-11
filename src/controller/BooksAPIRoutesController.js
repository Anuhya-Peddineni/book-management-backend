const express = require('express');
const logger = require('../common/Logger');

const router = express.Router();
const BooksAPIService = require('../service/BooksAPIService');
const BooksAPIRequestValidator = require('../validator/BooksAPIRequestValidator');

const booksAPIRequestValidator = new BooksAPIRequestValidator(logger);
const booksAPIService = new BooksAPIService(logger);

router.post('/', async (req, res) => {
  try {
    logger.debug('Create book route invoked from books API routes controller');
    booksAPIRequestValidator.validateRequest(req, 'POST');
    logger.debug('Create book request validation succeeded');
    const createdBook = await booksAPIService.createBook(req.body);
    logger.debug('Book creation succeeded', createdBook);
    return res.status(201).json(createdBook);
  } catch (error) {
    logger.error('Error while creating book ', error.message);
    if (error.errorType && error.message && error.httpStatus) {
      return res.status(error.httpStatus).json(getErrorResponse(error.message, error.errorType));
    }
    return res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
  }
});

router.get('/', async (req, res) => {
  try {
    logger.debug('Read book route invoked from books API routes controller');
    booksAPIRequestValidator.validateRequest(req, 'GET');
    logger.debug('Read book request validation succeeded');
    const bookDetail = await booksAPIService.readBook(req.query);
    logger.debug('Read book succeeded', bookDetail);
    return res.status(200).json(bookDetail);
  } catch (error) {
    logger.error('Error occurred while retrieving books ', error);
    if (error.errorType && error.message && error.httpStatus) {
      return res.status(error.httpStatus).json(getErrorResponse(error.message, error.errorType));
    }
    return res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
  }
});

router.get('/:bookId', async (req, res) => {
  try {
    logger.debug('Read book by id route invoked from books API routes controller');
    booksAPIRequestValidator.validateRequest(req, 'GETBYID');
    logger.debug('Read book by id request validation succeeded');
    const bookDetail = await booksAPIService.readBookById(req.params.bookId);
    logger.debug('Read book by id succeeded', bookDetail);
    return res.status(200).json(bookDetail);
  } catch (error) {
    logger.error('Error occurred while retrieving book ', error);
    if (error.errorType && error.message && error.httpStatus) {
      return res.status(error.httpStatus).json(getErrorResponse(error.message, error.errorType));
    }
    return res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
  }
});

router.put('/:bookId', async (req, res) => {
  try {
    logger.debug('Update book by route invoked from books API routes controller');
    booksAPIRequestValidator.validateRequest(req, 'PUT');
    logger.debug('Update book by id request validation succeeded');
    const bookDetail = await booksAPIService.updateBookById(req.body, req.params.bookId);
    logger.debug('Update book by id succeeded', bookDetail);
    return res.status(200).json(bookDetail);
  } catch (error) {
    logger.error('Error occurred while updating book ', error);
    if (error.errorType && error.message && error.httpStatus) {
      return res.status(error.httpStatus).json(getErrorResponse(error.message, error.errorType));
    }
    return res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
  }
});

router.delete('/:bookId', async (req, res) => {
  try {
    logger.debug('Delete book by id route invoked from books API routes controller');
    booksAPIRequestValidator.validateRequest(req, 'DELETE');
    logger.debug('Delete book by id request validation succeeded');
    const bookDetail = await booksAPIService.deleteBookById(req.params.bookId);
    logger.debug('Delete book by id succeeded', bookDetail);
    return res.status(204);
  } catch (error) {
    logger.error('Error occurred while deleting book ', error);
    if (error.errorType && error.message && error.httpStatus) {
      return res.status(error.httpStatus).json(getErrorResponse(error.message, error.errorType));
    }
    return res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
  }
});

function getErrorResponse(message, errorType) {
  return {
    resourceType: 'OperationOutcome',
    errorType,
    message,
  };
}

module.exports = router;
