const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
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
  },
  createdAt: {
    type: Date,
    required: true,
  },
  lastActiveAt: {
    type: Date,
    required: true,
  },
  gameHistory: {
    type: [],
  }, 
  stats: {
    type: [],
  },
  friends: {
    type: []
  }
})

const User = mongoose.model('User', userSchema, 'users')

module.exports = User