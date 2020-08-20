const mongoose = require('mongoose')

const Schema = mongoose.Schema

const testSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  }
})

const Test = mongoose.model('Test', testSchema, 'test')

module.exports = Test