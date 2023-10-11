const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const CustomError = require('../common/ErrorHandler');

const CreateAndUpdateBookSchema = require('./schema/BookSchema').schema;
const ReadBookSchema = require('./schema/ReadBookSchema').schema;
const ReadAndDeleteBookSchema = require('./schema/BookReadAndDeleteByIdSchema').pathSchema;

const ajv = new Ajv({
  verbose: true,
  $data: true,
  allErrors: true,
  strict: false,
});
addFormats(ajv);

module.exports = class BooksAPIRequestValidator {
  constructor(logger) {
    this.logger = logger;
  }

  validateRequest(request, requestType) {
    if (request.header('api-version') !== '1') {
      throw new CustomError('BadRequest', 'Invalid api-version header', 400);
    }
    let valid = false;
    switch (requestType) {
      case 'POST':
        valid = ajv.validate(CreateAndUpdateBookSchema, request.body);
        break;
      case 'GET':
        valid = ajv.validate(ReadBookSchema, request.query);
        break;
      case 'GETBYID':
      case 'DELETE':
        valid = ajv.validate(ReadAndDeleteBookSchema, request.params);
        break;
      case 'PUT':
        valid = ajv.validate(CreateAndUpdateBookSchema, request.body);
        valid = ajv.validate(ReadAndDeleteBookSchema, request.params);
        break;
      default:
        this.logger.error(`Provided request type ${requestType} is not accepted`);
        throw new CustomError(`Provided request type ${requestType} is not accepted`);
    }
    if (!valid) {
      const message = ajv.errors[0].parentSchema.customFHIRMessage
        ? ajv.errors[0].parentSchema.customFHIRMessage : ajv.errors[0].message;
      throw new CustomError('BadRequest', message, 400);
    }
  }
};
