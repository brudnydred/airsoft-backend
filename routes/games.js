const router = require('express').Router()
const gamesController = require('./../controllers/gamesControllers')

router.post('/', gamesController.addNewGame)

router.put('/join', gamesController.joinGame)

router.put('/team', gamesController.joinTeam)

router.put('/start', gamesController.start)

router.put('/end', gamesController.end)

router.put('/update', gamesController.updateGameState)

module.exports = router