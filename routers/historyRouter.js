const express = require('express')
const {historyController} = require('../controllers')

const router = express.Router()

router.post('/addToHistory', historyController.addToHistory)
// router.post('/addHistoryDetail/:id', historyController.addHistoryDetail)
router.get('/getHistoryByIdUser/:id', historyController.getHistoryByIdUser)
router.get('/getHistoryDetailById/:id', historyController.getHistoryDetailById)
router.put('/cancelHistoryById/:id', historyController.cancelHistoryByIdHistory)
router.put('/uploadBuktiPembayaran/:id', historyController.uploadBuktiPembayaran)
router.put('/pembayaranSubmit/:id', historyController.pembayaranSubmit)

module.exports = router
