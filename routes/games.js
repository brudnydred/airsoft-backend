const router = require('express').Router()
const Game = require('./../models/game.model')

router.get('/', (req, res) => {
  res.json('Get games')
})

router.post('/add', (req, res) => {
  res.json('Add game')
})

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  res.json(`Delete game -> id: ${id}`)
})

router.put('/update/:id', async (req, res) => {
  const id = req.params.id
  res.json(`Update game -> id: ${id}`)
})

module.exports = router