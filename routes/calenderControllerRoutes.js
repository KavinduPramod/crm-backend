const express = require('express')
const { events } = require('../controller/calenderController')
const { verifyUser } = require('../middleware/middleware')
const router = express.Router()

router.post('/new_event', events);

module.exports = router