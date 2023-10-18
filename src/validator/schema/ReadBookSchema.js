module.exports = {
  schema: {
    type: 'object',
    properties: {
      genre: {
        type: 'string',
        enum: ['Horror', 'Thriller', 'Common'],
        customFHIRMessage: 'Invalid genre passed',
      },
    },
    additionalProperties: false,
  },
};
