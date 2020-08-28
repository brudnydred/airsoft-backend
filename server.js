const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const path = require('path')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Expose-Headers', 'auth-token')
  next()
})

app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true })

const connection = mongoose.connection

connection.once('open', () => {
  console.log('Database connected')
})

const usersRouter = require('./routes/users')
const gamesRouter = require('./routes/games')
// const testRouter = require('./routes/test')

app.use('/users', usersRouter)
app.use('/games', gamesRouter)
// app.use('/test', testRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})