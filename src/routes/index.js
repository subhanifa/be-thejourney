const express = require('express')
const router = express.Router()

const { auth } = require('../middlewares/auth')

const { register, login } = require('../controllers/auth')
const { uploadFile } = require('../middlewares/uploadFile')
const { addStory } = require('../controllers/story')



router.post('/register', register)
router.post('/login', login)

router.post('/story', auth, uploadFile("image"), addStory)


module.exports = router