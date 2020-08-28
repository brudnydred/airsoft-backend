const router = require('express').Router()
const usersController = require('./../controllers/usersControllers')
const verifyToken = require('./../middlewares/verifyToken')

router.get('/', verifyToken, usersController.findAll)

router.get('/:id', usersController.findOne)

router.post('/signup', usersController.signUp)

router.post('/signin', usersController.signIn)

router.put('/:id/signout', usersController.signOut)

router.delete('/:id', usersController.delete)

router.put('/:id', usersController.update)

router.put('/:id/friend', usersController.addFriend)

router.delete('/:id/friend', usersController.removeFriend)

module.exports = router