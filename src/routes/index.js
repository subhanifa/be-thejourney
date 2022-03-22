const express = require('express')
const router = express.Router()

const { auth } = require('../middlewares/auth')

const { register, login, checkAuth } = require('../controllers/auth')
const { uploadFile } = require('../middlewares/uploadFile')
const { addStory, getStories, getStory, deleteStory, getUserStories } = require('../controllers/story')
const { addBookmark, deleteBookmark, getBookmarks, getBookmark, getUserBookmarks } = require('../controllers/bookmark')
const { addUsers, getUsers, getUser, updateUserImage } = require('../controllers/user')

router.post('/user', addUsers)
router.get('/users', getUsers)
// router.get('/user/:id', getUser)
router.get('/profile', getUser)
// router.patch('/user/:id', updateUser)
router.patch("/user/edit/image", auth,  uploadFile("image"), updateUserImage);


router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth);

router.post('/story', auth, uploadFile("image"), addStory)
router.get('/stories', getStories)
router.get('/user-stories', getUserStories)
router.get('/story/:id', getStory)
router.delete('/story/:id', auth, deleteStory)

router.post('/bookmark', auth, addBookmark)
router.get('/bookmarks', getBookmarks)
router.get('/user-bookmarks', getUserBookmarks)
router.get('/bookmark/:id', getBookmark)
router.delete('/bookmark/:id', auth, deleteBookmark)





module.exports = router