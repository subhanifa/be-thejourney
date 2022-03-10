const express = require('express')
const router = express.Router()

const { auth } = require('../middlewares/auth')

const { register, login } = require('../controllers/auth')
const { uploadFile } = require('../middlewares/uploadFile')
const { addStory, getStories, getStory, deleteStory } = require('../controllers/story')
const { addBookmark } = require('../controllers/bookmark')



router.post('/register', register)
router.post('/login', login)

router.post('/story', auth, uploadFile("image"), addStory)
router.get('/stories', getStories)
router.get('/story/:id', getStory)
router.delete('/story/:id',auth, deleteStory)

router.post('/bookmark', auth, addBookmark)




module.exports = router