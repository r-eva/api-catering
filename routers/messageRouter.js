const express = require('express')
const router = express.Router()
const {MessageController} = require('../controllers')

router.get('/', MessageController.getConnection)


module.exports = router