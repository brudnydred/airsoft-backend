const mongoose = require('mongoose')

const Schema = mongoose.Schema

const gameSchema = new Schema({
  gameCode: {
    type: String,
    required: true,
    unique: true
  },
  gameName: {
    type: String, 
    required: true
  },
  gamePassword: {
    type: String,
    trim: true
  },
  teamBlue: {
    type: []
  },
  teamRed: {
    type: []
  },
  teamBlueScores: {
    type: Number,
    required: true,
    default: 0
  },
  teamRedScores: {
    type: Number,
    required: true,
    default: 0
  },
  winner: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  gameTime: {
    type: Number,
    required: true,
    default: 0
  },
  isRunning: {
    type: Boolean,
    required: true,
    default: false
  },
  isFinished: {
    type: Boolean,
    required: true,
    default: false
  },
  location: {
    type: String,
    required: true
  },
  numberOfPlayers: {
    type: Number,
    default: 0
  },
  playersIds: {
    type: [],
  },
  isPublic: {
    type: Boolean,
    required: true
  }
})

const Game = mongoose.model('Game', gameSchema, 'games')

module.exports = Game