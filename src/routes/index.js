const express = require('express')
const router = express.Router()

const { auth } = require('../middlewares/auth')

const { register } = require('../controllers/auth')










router.post('/register', register)



module.exports = router