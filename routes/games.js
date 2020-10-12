const router = require('express').Router()
const gamesController = require('./../controllers/gamesControllers')
const usersController = require('./../controllers/usersControllers')

router.post('/', gamesController.addNewGame)

router.post('/join', gamesController.joinGame)

router.put('/team', gamesController.joinTeam)

router.put('/start', gamesController.start)

router.put('/end', gamesController.end)

router.put('/update', gamesController.updateGameState)

router.get('/:gameId/teams', usersController.findAll, gamesController.getTeams)

router.get('/:gameId/stats', gamesController.getStats)

router.get('/:gameId/reconnect/:userId', gamesController.reconnect)

router.delete('/:gameId', gamesController.deleteGame)

module.exports = router