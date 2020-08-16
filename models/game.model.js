const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gameSchema = new Schema({
  gameName: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  gamePassword: {
    type: String,
    required: true,
    minlength: 8,
    trim: true
  },
  teamOneName: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  teamTwoName: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  teamOneScores: {
    type: Number,
    required: true
  },
  teamTwoScores: {
    type: Number,
    required: true
  },
  winner: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  gameTime: {
    type: Date,
    required: true
  },
  isRunning: {
    type: Boolean,
    required: true,
    default: false
  }
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game