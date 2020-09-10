const User = require('./../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const BCRYPT_SALT_ROUNDS = 12

module.exports = {
  findAll: async (req, res) => {
    try {
      const users = await User.find()
  
      res.status(200).json({ success: true, data: users, statusCode: 'US0' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err }) 
    }
  },

  findOne: async (req, res, next) => {
    const { id } = req.params

    try {
      const user = await User.find({ _id: id})
  
      if (!user.length) {
        res.status(400).json({ success: false, statusCode: 'UF0' })
        next()
      }

      res.status(200).json( { success: true, data: user, statusCode: 'US1' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  }, 

  signUp: async (req, res) => {
    const { username, password, email } = req.body

    if (password.length === 0) {
      return res.status(400).json({ success: false, statusCode: 'UF1' })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
      })
      
      await newUser.save()
      res.status(200).json({ success: true, statusCode: 'US2' })
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000)  {
        return res.status(400).json({ success: false, statusCode: 'UF2' })
      }

      if (err.errors.username?.kind === 'required') {
        return res.status(400).json({ success: false, statusCode: "UF3" })
      }
  
      if (err.errors.username?.kind === 'minlength') {
        return res.status(400).json({ success: false, statusCode: "UF4" })
      }
      
      if (err.errors.email?.kind === 'required') {
        return res.status(400).json({ success: false, statusCode: "UF5" })
      }
      
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  signIn: async (req, res, next) => {
    const { username, password } = req.body

    if (!username.length) {
      return res.status(400).json({ success: false, statusCode: "UF3" })
    }

    try {
      const user = await User.findOne({ username: username })
      
      if (user === null) {
        return res.status(400).json({ success: false, statusCode: 'UF0'})
      }

      if (!await bcrypt.compare(password.toString(), user.password.toString())) {
        res.status(400).json({ success: false, statusCode: "UF6"})
        return next()
      }

      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET)
      res.header('auth-token', token)
      res.status(200).json({ success: true, statusCode: 'US3' })
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  signOut: async (req, res) => {
    const { id } = req.params

    try {
      await User.updateOne({ _id: id }, {
        $set: {
          lastActiveAt: new Date()
        }
      })

      res.status(200).json({ success: true, statusCode: 'US4'})
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })    
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params

    if (!id) {
      res.status(400).json({ success: false, statusCode: 'UF8' })
      return next()
    }

    try {
      const { friends } = await User.findOneAndDelete({ _id: id })

      await User.updateMany({ _id: { $in: friends }}, {
        $pull: {
          friends: id
        }
      })
      
      res.status(200).json('User deleted')
    } catch (err) {
      res.status(400).json({ success: false, statusCode: 'UNH', error: err })
    }
  },

  update: async (req, res, next) => {
    const { username, password, email } = req.body
    const { id } = req.params
  
    if (!username || !password || !email) {
      res.status(400).json({ success: false, statusCode: 'UF7' })
      return next()
    }

    if (!id) {
      res.status(400).json({ success: false, statusCode: 'UF8' })
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
      res.status(200).json({ success: true, statuCode: 'US6' })
    } catch (err) {
      res.status(400).json({ success: false, statuCode: 'UNH', error: err })    
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
        res.status(400).json({ success: false, statuCode: 'UF0' })
        return next()
      }

      if (id.toString() === friendData._id.toString()) {
        res.status(400).json({ success: false, statuCode: 'UF9' })
        return next()
      }

      const { friends } = await User.findOne({ _id: id }, 'friends -_id')

      if (friends.some(friend => friend.toString() === friendData._id.toString())) {
        res.status(400).json({ success: false, statuCode: 'UF10' })
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

      res.status(200).json({ success: true, statuCode: 'US7'})
    } catch (err) {
      res.status(400).json({ success: false, statuCode: 'UNH', error: err })
    }
  },

  removeFriend: async (req, res, next) => {
    const { id } = req.params
    const { friendId } = req.body

    if (!friendId) {
      res.status(400).json({ success: false, statuCode: 'UF11' })
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
  
      res.status(200).json({ success: true, statuCode: 'US8' })
    } catch (err) {
      res.status(400).json({ success: false, statuCode: 'UNH', error: err })
    }
  }
}