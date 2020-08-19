const User = require('./../models/user.model')
const bcrypt = require('bcrypt')
const e = require('express')

const BCRYPT_SALT_ROUNDS = 12

module.exports = {
  findAll: async (req, res) => {
    try {
      const users = await User.find()
  
      res.json(users)
    } catch (err) {
      res.json(`Error: ${err}`)
    }
  },

  findOne: async (req, res, next) => {
    const { id } = req.params

    try {
      const users = await User.find({ _id: id})
  
      if (!users.length) {
        res.json('There is no user with that id')
        next()
      }

      res.json(users)
    } catch (err) {
      res.json(`Error: ${err}`)
    }
  }, 

  signUp: async (req, res) => {
    const { username, password, email } = req.body

    try {
      if ((await User.find({ username: username })).length || (await User.find({ email: email })).length) {
        res.json('This username or email is taken.')
      } else {
        const currentDate = new Date()
        const createdAt = currentDate
        const lastActiveAt = currentDate
  
        const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  
        const newUser = new User({
          username,
          password: hashedPassword,
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
  },

  signIn: async (req, res) => {
    const { username, password } = req.body

    try {
      const { password: hashedPassword } = await User.findOne({ username: username }, 'password -_id')
      if (await bcrypt.compare(password.toString(), hashedPassword.toString())) {
        res.json('Logged in')
      } else {
        res.json(`Wrong username or password`)
      }
    } catch (err) {
      res.json('Wrong username or password')
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params
  
    if (!id) {
      res.json('There is no id')
      return next()
    }

    try {
      await User.deleteOne({ _id: id })
      res.json('User deleted')
    } catch (err) {
      res.json(`Error: ${err}`)
    }
  },

  update: async (req, res, next) => {
    const { username, password, email } = req.body
    const { id } = req.params
  
    if (!username || !password || !email) {
      res.json('There is no username or password or email')
      return next()
    }

    if (!id) {
      res.json('There is no id')
      return next()
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)

    try {
      await User.updateOne({ _id: id }, {
        $set: {
          username: username,
          password: hashedPassword,
          email: email
        }
      })
      res.json('User updated')
    } catch (err) {
      res.json(`Error: ${err}`)    
    }
  },

  logout: async (req, res) => {
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
  },

  addFriend: async (req, res, next) => {
    const { id } = req.params
    const { friendId, friendUsername } = req.body
    let friendData

    try {
      if (!friendUsername && friendId) {
        friendData = await User.findOne({ _id: friendId })
      } else {
        friendData = await User.findOne({ username: friendUsername })
      }

      if (friendData === null) {
        res.json('User not found')
        return next()
      }

      if (id.toString() === friendData._id.toString()) {
        res.json('You cannot add yourself as friends')
        return next()
      }

      const { friends } = await User.findOne({ _id: id }, 'friends -_id')

      if (friends.some(friend => friend.toString() === friendData._id.toString())) {
        res.json(`${friendData.username} is already your friend`)
        return next()
      }

      await User.updateOne({ _id: id }, {
        $push: {
          friends: friendData._id.toString()
        }
      })

      await User.updateOne({ _id: friendData._id }, {
        $push: {
          friends: id.toString()
        }
      })

      res.json('Friend added!')
    } catch (err) {
      res.json(`Error: ${err}`)
    }
  },

  removeFriend: async (req, res, next) => {
    const { id } = req.params
    const { friendId } = req.body

    if (!friendId) {
      res.json('There is friend id')
      return next()
    }

    try {
      await User.updateOne({ _id: id }, {
        $pull: {
          friends: friendId
        }
      })
  
      await User.updateOne({ _id: friendId }, {
        $pull: {
          friends: id
        }
      })
  
      res.json('Friend removed')
    } catch (err) {
      res.json(`Error: ${err}`)
    }
  }
}