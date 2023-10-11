module.exports = {
  schema: {
    type: 'object',
    minProperties: 1,
    required: ['resourceType', 'title', 'author', 'isbn'],
    customFHIRMessage: 'Request body should be an object with required fields',
    properties: {
      resourceType: { type: 'string', enum: ['Book'], customFHIRMessage: 'Incorrect resourceType passed' },
      title: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^[a-zA-Z0-9-_. ]+$',
      },
      author: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^[a-zA-Z0-9-_. ]+$',
      },
      isbn: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^[a-zA-Z0-9-_. ]+$',
      },
      genre: {
        type: 'string',
        enum: ['Horror', 'Thriller', 'Common'],
      },
    },
    additionalProperties: false,
  },
};
