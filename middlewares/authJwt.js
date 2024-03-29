const jwt = require('jsonwebtoken')
const config = require('../config/auth')
const db = require('../models')
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
  let token = req.headers['authorization']
  if (!token) {
    return res.status(403).send({ message: 'No token provided' })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized' })
    }
    if (Date.now() >= decoded.exp) {
      return res.status(403).send({ auth: false, message: 'Token expired' })
    }
    req.userId = decoded.userId
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }

    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next()
            return
          }
        }
        res.status(403).send({ message: 'Require Admin Role' })
      },
    )
  })
}

const authJwt = {
  verifyToken,
  isAdmin,
}

module.exports = authJwt
