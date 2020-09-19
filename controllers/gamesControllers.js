const Games = require('./../models/game.model')
const bcrypt = require('bcrypt')
const Game = require('./../models/game.model')

const BCRYPT_SALT_ROUNDS = 12
const CHARS = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789']

module.exports = {
  addNewGame: async (req, res) => {
    const { userId: hostId, gamePassword, location, isPublic, gameName } = req.body
    let hashedGamePassword
    
    const gameCode = [...'xxxxxx'].map(i => i = CHARS[Math.floor(Math.random() * CHARS.length)]).join('')

    try {
      if (gamePassword) {
        hashedGamePassword = await bcrypt.hash(gamePassword, BCRYPT_SALT_ROUNDS)
      }

      const newGame = new Game({
        gameCode: gameCode,
        gamePassword: gamePassword ? hashedGamePassword : '',
        gameName,
        location,
        isPublic
      })

      const gameId = newGame._id

      await newGame.save()

      await Game.updateOne({ _id: gameId }, {
        $push: {
          playersIds: hostId
        }, 
        $set: {
          numberOfPlayers: 1
        }
      })

      res.status(200).json({ success: true, statusCode: 'GS0', gameId: gameId, gameCode: gameCode })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'GF0' })
    }
  },

  joinGame: async (req, res) => {
    const { userId, gameCode, gamePassword } = req.body

    try {
      const game = await Game.findOne({ gameCode: gameCode }, 'isFinished gamePassword isRunning numberOfPlayers')

      if (game.isRunning) {
        res.status(400).json({ success: false, statusCode: 'GF1'})
        return
      }

      if (game.isFinished) {
        res.status(400).json({ success: false, statusCode: 'GF2'})
        return
      }

      if (gamePassword && !await bcrypt.compare(gamePassword.toString(), game.gamePassword.toString())) {
        res.status(400).json({ success: false, statusCode: 'GF3' })
        return 
      }

      const currentNumberOfPlayers = game.numberOfPlayers + 1

      await Game.updateOne({ gameCode: gameCode }, {
        $push: {
          playersIds: userId
        },
        $set: {
          numberOfPlayers: currentNumberOfPlayers
        }
      })

      res.status(200).json({ success: true, statusCode: 'GS1', gameId: game._id  })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  joinTeam: async (req, res) => {
    const { userId, team, gameId } = req.body

    try {
      const game = await Game.findOne({ _id: gameId })
      
      if (game.isRunning) {
        res.status(400).json({ success: false, statusCode: 'GF4' })
        return
      }

      if (team === 'blue') {
        await Game.updateOne({ _id: gameId }, {
          $push: {
            teamBlue: userId
          }
        })

        res.status(200).json({ success: true, statusCode: 'GS2' })
        return
      } else {
        await Game.updateOne({ _id: gameId }, {
          $push: {
            teamRed: userId
          }
        })

        res.status(200).json({ success: true, message: 'GS2' })
        return
      }

    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  start: async (req, res) => {
    const { gameId } = req.body

    try {
      await Game.updateOne({ _id: gameId }, {
        $set: {
          isRunning: true
        }
      })

      res.status(200).json({ success: true, statusCode: 'GS3' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  end: async (req, res) => {
    const { gameId, gameTime, teamRedScores, teamBlueScores } = req.body

    try {
      await Game.updateOne({ _id: gameId }, {
        $set: {
          isRunning: false,
          isFinished: true,
          gameTime: gameTime,
          teamBlueScores: teamBlueScores, 
          teamRedScores: teamRedScores,
          winner: teamRedScores > teamBlueScores ? 'Team Red' : 'Team Blue',
          gameCode: `${Date.now()}`
        }
      })

      res.status(200).json({ success: true, statusCode: 'GS4' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })      
    }
  },

  updateGameState: async (req, res) => {
    const { gameId, gameTime, teamRedScores, teamBlueScores } = req.body 

    try {
      const game = await Game.findOne({ _id: gameId })

      if (game.isFinished && !game.isRunning) {
        res.status(400).json({ success: false, statusCode: 'GF5' })
        return 
      }

      await Game.updateOne({ _id: gameId }, {
        $set: {
          gameTime: gameTime,
          teamBlueScores: teamBlueScores, 
          teamRedScores: teamRedScores
        }
      })

      res.status(200).json({ success: true, statusCode: 'GS5' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })            
    }
  } 
}