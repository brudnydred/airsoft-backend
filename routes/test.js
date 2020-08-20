const router = require('express').Router()
const Test = require('./../models/test.model')

router.get('/', async (req, res) => {
  try {
    const tests = await Test.find()
    res.status(200).json(tests)
  } catch (err) {
    res.status(400).json(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const test = await Test.find({ _id: req.params.id })
    res.status(200).json(test)
  } catch (err) {
    res.status(400).json(err)
  }
})

router.post('/', async (req, res) => {
  const newTest = new Test({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  })

  try {
    await newTest.save()
    res.status(200).json('Added')
  } catch (err) {
    res.status(400).json(err)
  }
})

// router.put('/:id', (req, res, next) => {

// })

// router.delete('/:id', (req, res, next) => {

// })

module.exports = router