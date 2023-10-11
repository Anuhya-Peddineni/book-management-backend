module.exports = {
  pathSchema: {
    type: 'object',
    required: ['bookId'],
    customFHIRMessage: 'Book id is not passed',
    properties: {
      bookId: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^([a-z0-9]+[a-z0-9\\-]*[a-z0-9]+)+$',
      },
    },
    additionalProperties: false,
  },
};
