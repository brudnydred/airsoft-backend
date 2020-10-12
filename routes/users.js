const router = require('express').Router()
const usersController = require('./../controllers/usersControllers')
const verifyToken = require('./../middlewares/verifyToken')

router.get('/:id', verifyToken, usersController.findOne)

router.post('/signup', usersController.signUp)

router.post('/signin', usersController.signIn)

router.put('/:id/signout', verifyToken, usersController.signOut)

router.delete('/:id', verifyToken, usersController.delete)

router.put('/:id', verifyToken, usersController.update)

router.put('/:id/friend', verifyToken, usersController.addFriend)

router.delete('/:id/friend', verifyToken, usersController.removeFriend)

module.exports = router