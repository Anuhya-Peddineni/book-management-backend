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
        if (valid === false) break;
        valid = ajv.validate(ReadAndDeleteBookSchema, request.params);
        break;
      default:
        this.logger.error(`Provided request type ${requestType} is not accepted`);
        throw new CustomError(`Provided request type ${requestType} is not accepted`);
    }
    if (!valid) {
      console.log(ajv.errors[0]);
      let message;
      if (ajv.errors[0].keyword === 'pattern') {
        message = `Provided field ${ajv.errors[0].instancePath.replace('/', '')} has invalid characters`;
      } else if (ajv.errors[0].keyword === 'enum') {
        message = `Invalid ${ajv.errors[0].instancePath.replace('/', '')} passed`;
      } else if (ajv.errors[0].keyword === 'minLength') {
        message = `Provided field ${ajv.errors[0].instancePath.replace('/', '')} should atleast have ${ajv.errors[0].params.limit} characters`;
      } else if (ajv.errors[0].keyword === 'maxLength') {
        message = `Provided field ${ajv.errors[0].instancePath.replace('/', '')} can have atmost have ${ajv.errors[0].params.limit} characters`;
      } else if (ajv.errors[0].parentSchema.customFHIRMessage) {
        message = ajv.errors[0].parentSchema.customFHIRMessage;
      } else {
        message = ajv.errors[0].message;
      }
      throw new CustomError('BadRequest', message, 400);
    }
  }
};
