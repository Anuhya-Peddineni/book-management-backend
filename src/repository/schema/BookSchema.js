const mongoose = require('mongoose');

const bookDBSchema = new mongoose.Schema({
  resourceType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    default: 'Common',
  },
});

module.exports = mongoose.model('bookDBSchema', bookDBSchema);
