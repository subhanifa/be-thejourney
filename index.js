require('dotenv').config()

const express = require('express')
const cors = require('cors')

const router = require('./src/routes')
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

// Add endpoint grouping and routing
app.use('/api/v1/', router)

app.use('/uploads', express.static('uploads'))

app.listen(port, () => console.log(`Starting on port ${port}!`))