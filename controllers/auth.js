const config = require('../config/auth')
const db = require('../models')
const User = db.user
const Role = db.role

var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err })
            return
          }
          user.roles = roles.map((role) => role._id)
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err })
              return
            }

            res.send({ message: 'User was registered succesfully' })
          })
        },
      )
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err })
          return
        }
        res.send({ message: 'User was registered succesfully' })
      })
    }
  })
}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate('roles', '-___v')
    .then((user) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        })
      }

      const expirationTime = 86400
      var dateNow = new Date()
      var calculatedExpiresIn =
        dateNow.getTime() +
        expirationTime * 100 -
        (dateNow.getTime() - dateNow.getMiliseconds()) / 1000
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: calculatedExpiresIn,
      })

      var authorities = []
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase())
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      })
    })
    .catch((err) => {
      if (err) {
        res.status(500).send({ message: err })
      }
    })
}
