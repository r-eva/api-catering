const { sqlDB } = require('../database')

module.exports = {
    getKategoriLangganan: (req, res) => {
        var sql = `SELECT id, namaPaket from kategori_langganan`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    getJadwalLangganan: (req, res) => {
        var sql = `SELECT kl.id, kl.namaPaket, am.Menu, ct.urutan
                    FROM kategori_langganan kl
                    JOIN all_menu am
                    JOIN connection_table ct
                    ON ct.idMenu = am.id && ct.idKategori = kl.id
                    WHERE kl.id = ${req.params.id}
                    ORDER BY ct.urutan;`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    getJumlahPesananPerhari: (req, res) => {
        var sql = `SELECT hd.id, hd.idUser, u.username, hd.idPaket,
                    kl.namaPaket, hd.TanggalMulai, hd.TanggalBerakhir,
                    hd.JumlahBox, h.NamaPenerima, h.AlamatPenerima, h.KodePosPenerima
                    FROM history_detailproduct hd
                    JOIN kategori_langganan kl
                    JOIN history h
                    JOIN users u
                    on hd.idHistory = h.id && hd.idPaket = kl.id && hd.idUser = u.id
                    WHERE h.Status = 'PAID OFF'
                    && hd.TanggalMulai <= '${req.params.tanggal}'
                    && hd.TanggalBerakhir >= '${req.params.tanggal}';`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    }
}


