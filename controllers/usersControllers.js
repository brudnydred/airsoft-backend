const User = require('./../models/user.model')
const bcrypt = require('bcrypt')

const BCRYPT_SALT_ROUNDS = 12

module.exports = {
  findAll: async (req, res) => {
    try {
      const users = await User.find()
  
      res.status(200).json(users)
    } catch (err) {
      res.status(400).json(`Error: ${err}`)
    }
  },

  findOne: async (req, res, next) => {
    const { id } = req.params

    try {
      const user = await User.find({ _id: id})
  
      if (!user.length) {
        res.status(400).json('There is no user with that id')
        next()
      }

      res.status(200).json(user)
    } catch (err) {
      res.status(400).json(`Error: ${err}`)
    }
  }, 

  signUp: async (req, res) => {
    const { username, password, email } = req.body

    try {
      if ((await User.find({ username: username })).length || (await User.find({ email: email })).length) {
        res.status(400).json('This username or email is taken.')
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
          res.status(200).json('User added')
        } catch (err) {
          res.status(400).json(`Error: ${err}`)
        }
      }
    } catch (err) {
      res.status(400).json(`Error: ${err}`)
    }
  },

  signIn: async (req, res, next) => {
    const { username, password } = req.body

    console.log(username, password)

    try {
      const { password: hashedPassword } = await User.findOne({ username: username }, 'password -_id')
      
      if (!await bcrypt.compare(password.toString(), hashedPassword.toString())) {
        res.status(400).json('Wrong username or password')
        return next()
      }
      res.status(200).json('Logged in')
    } catch (err) {
      res.status(400).json('Wrong username or password')
    }
  },

  delete: async (req, res, next) => {
    const { id } = req.params
  
    if (!id) {
      res.status(400).json('There is no id')
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
      res.status(400).json(`Error: ${err}`)
    }
  },

  update: async (req, res, next) => {
    const { username, password, email } = req.body
    const { id } = req.params
  
    if (!username || !password || !email) {
      res.status(400).json('There is no username or password or email')
      return next()
    }

    if (!id) {
      res.status(400).json('There is no id')
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
      res.status(200).json('User updated')
    } catch (err) {
      res.status(400).json(`Error: ${err}`)    
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
      res.status(200).json('User logged out')
    } catch (err) {
      res.status(400).json(`Error: ${err}`)    
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
        res.status(400).json('User not found')
        return next()
      }

      if (id.toString() === friendData._id.toString()) {
        res.status(400).json('You cannot add yourself as friends')
        return next()
      }

      const { friends } = await User.findOne({ _id: id }, 'friends -_id')

      if (friends.some(friend => friend.toString() === friendData._id.toString())) {
        res.status(400).json(`${friendData.username} is already your friend`)
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

      res.status(200).json('Friend added!')
    } catch (err) {
      res.status(400).json(`Error: ${err}`)
    }
  },

  removeFriend: async (req, res, next) => {
    const { id } = req.params
    const { friendId } = req.body

    if (!friendId) {
      res.status(400).json('There is no friend id')
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
  
      res.status(200).json('Friend removed')
    } catch (err) {
      res.status(400).json(`Error: ${err}`)
    }
  }
}