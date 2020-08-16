const router = require('express').Router()
const User = require('./../models/user.model')

router.get('/', (req, res) => {
  res.json('Get users')
})

router.post('/add', (req, res) => {
  res.json('Add user')
})

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  res.json(`Delete user -> id: ${id}`)
})

router.put('/update/:id', async (req, res) => {
  const id = req.params.id
  res.json(`Update user -> id: ${id}`)
})

module.exports = router