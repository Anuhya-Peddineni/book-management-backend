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
        pattern: '^[0-9a-fA-F]{24}$',
      },
    },
    additionalProperties: false,
  },
};
