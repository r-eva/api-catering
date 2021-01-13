const express = require('express')
const {jadwalController} = require('../controllers')

const router = express.Router()

router.get('/getJadwalByIdPaket/:id', jadwalController.getJadwalByIdPaket)
router.get('/getAllMenu', jadwalController.getAllMenu)
router.put('/editJadwalById', jadwalController.editJadwalById)
router.delete('/deleteJadwalById/:id', jadwalController.deleteConnection)
router.post('/addConnection', jadwalController.addConnection)
router.post('/addMenuBaruDanConnection', jadwalController.addMenuBaruDanConnection)

module.exports = router
