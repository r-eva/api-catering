const express = require('express')
const {adminDasboardController} = require('../controllers')

const router = express.Router()

router.get('/getTransaksiMenunggu', adminDasboardController.getTransaksiMenunggu)
router.put('/confirmPembayaran', adminDasboardController.confirmPembayaran)
router.put('/rejectPembayaran', adminDasboardController.rejectPembayaran)

module.exports = router
