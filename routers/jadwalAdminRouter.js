const express = require('express')
const {JadwalAdminController} = require('../controllers')

const router = express.Router()

router.get('/getKategoriLangganan', JadwalAdminController.getKategoriLangganan)
router.get('/getJadwalLangganan/:id', JadwalAdminController.getJadwalLangganan)
router.get('/getJumlahPesananPerhari/:tanggal', JadwalAdminController.getJumlahPesananPerhari)

module.exports = router
