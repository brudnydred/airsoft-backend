const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.header('auth-token')

  console.log(`token: ${token}`)

  if (!token) return res.status(401).json({ success: false, message: "Access Denied"})

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid Token" })
  }
}