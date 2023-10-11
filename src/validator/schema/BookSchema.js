module.exports = {
  schema: {
    type: 'object',
    minProperties: 1,
    required: ['resourceType', 'title', 'author', 'isbn'],
    customFHIRMessage: 'Request body should be an object with required fields',
    properties: {
      resourceType: { type: 'string', enum: ['Book'], customFHIRMessage: 'Incorrect resourceType passed' },
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^([a-z0-9]+[a-z0-9\\-]*[a-z0-9]+)+$',
      },
      title: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^([a-z0-9]+[a-z0-9\\-]*[a-z0-9]+)+$',
      },
      author: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^([a-z0-9]+[a-z0-9\\-]*[a-z0-9]+)+$',
      },
      isbn: {
        type: 'string',
        minLength: 3,
        maxLength: 63,
        pattern: '^([a-z0-9]+[a-z0-9\\-]*[a-z0-9]+)+$',
      },
      genre: {
        type: 'string',
        enum: ['Horror', 'Thriller', 'Common'],
      },
    },
    additionalProperties: false,
  },
};
