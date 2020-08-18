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

  try {
    if ((await User.find({ username: username })).length || (await User.find({ email: email })).length) {
      res.json('This username or email is taken.')
    } else {
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
    }
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

router.put('/logout/:id', async (req, res) => {
  const { id } = req.params

  try {
    await User.updateOne({ _id: id }, {
      $set: {
        lastActiveAt: new Date()
      }
    })
    res.json('User logged out')
  } catch (err) {
    res.json(`Error: ${err}`)    
  }
})

router.put('/add_friend/:id', async (req, res) => {
  const { id } = req.params
  const { friendUsername } = req.body

  try {
    const { friends } = await User.findOne({ _id: id }, 'friends -_id')

    if (friends.some(friend => friend === friendUsername)) {
      res.json(`${friendUsername} is already your friend`)
    } else {
      try {
        const friendData = await User.findOne({ username: friendUsername }, '_id')
        const userData = await User.findOne({ _id: id }, 'username -_id')

        if (friendData?._id) {
          try {
            await User.updateOne({ _id: id }, {
              $push: {
                friends: friendUsername
              }
            })

            await User.updateOne({ _id: friendData._id }, {
              $push: {
                friends: userData.username
              }
            })

            res.json('Friend added')
          } catch (err) {
            res.json(`Error: ${err}`)
          }
        } else {
          res.json('User not found')
        }
      } catch (err) {
        res.json(`Error: ${err}`)  
      }
    }
  } catch (err) {
    res.json(`Error: ${err}`)
  }
})

router.put('/remove_friend/:id', async (req, res) => {
  const { id } = req.params
  const { friendUsername } = req.body

  try {
    const { _id: friendId } = await User.findOne({ username: friendUsername }, '_id')
    const { username: userUsername } = await User.findOne({ _id: id }, 'username -_id')

    await User.updateOne({ _id: id }, {
      $pull: {
        friends: friendUsername
      }
    })

    await User.updateOne({ _id: friendId }, {
      $pull: {
        friends: userUsername
      }
    })

    res.json('Friend removed')
  } catch (err) {
    res.json(`Error: ${err}`)
  }
})

module.exports = router