const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.render('index')
})

router.get('/policy', (req, res, next) => {
  res.render('policy')
})

router.get('/about', (req, res, next) => {
  res.render('about')
})

router.get('/dashboard', (req, res, next) => {
  // $0 becomes $0.00
  req.session.passport.user.balance.toFixed(2)
  res.render('dashboard', { user: req.session.passport.user })
})

module.exports = router