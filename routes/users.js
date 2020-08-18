const router = require('express').Router()
const User = require('./../models/user.model')

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.json(`Error: ${err}`)
  }
})

router.post('/add', async (req, res) => {
  const { username, password, email } = req.body
  
  const currentDate = new Date()
  const createdAt = currentDate
  const lastActiveAt = currentDate

  const newUser = new User({
    username,
    password,
    email,
    createdAt,
    lastActiveAt,
  })

  try {
    await newUser.save()
    res.json('User added')
  } catch (err) {
    res.json(`Error: ${err}`)
  }
})

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params
  try {
    await User.deleteOne({ _id: id })
    res.json('User deleted')
  } catch (err) {
    res.json(`Error: ${err}`)
  }
})

router.put('/update/:id', async (req, res) => {
  const { username, password, email } = req.body
  const { id } = req.params

  try {
    await User.updateOne({ _id: id }, {
      $set: {
        username: username,
        password: password,
        email: email
      }
    })
    res.json('User updated')
  } catch (err) {
    res.json(`Error: ${err}`)    
  }
})

router.put('/logout', (req, res) => {

})

router.put('/remove_friend/:id', (req, res) => {

})

module.exports = router