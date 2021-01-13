const express = require('express')
const {PesananController} = require('../controllers')

const router = express.Router()

router.get('/getPesananBulanIni', PesananController.getSeluruhPesananBulanIni)
router.get('/jumlahBoxTerjualBulanIni', PesananController.jumlahBoxTerjualBulanIni)
router.get('/daftarProdukTerbaik', PesananController.daftarProdukTerbaik)
router.get('/daftarUserTerbaik', PesananController.daftarUserTerbaik)

module.exports = router
