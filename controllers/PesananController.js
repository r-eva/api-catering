const { sqlDB } = require('../database')
const moment = require('moment')

module.exports = {
    getSeluruhPesananBulanIni: (req, res) => {
        var sql = `SELECT * FROM history WHERE TanggalTransaksi >= '${moment().startOf('month').format('YYYY-MM-DD')}' && TanggalTransaksi <= '${moment().endOf('month').format('YYYY-MM-DD')}'
        && Status = 'PAID OFF';`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    jumlahBoxTerjualBulanIni: (req, res) => {
        var sql = `SELECT SUM(Durasi * JumlahBox) as TotalBox
        FROM history_detailproduct hd
        JOIN history h
        on h.id = hd.idHistory
        WHERE h.Status = 'PAID OFF' 
        && h.TanggalTransaksi >= '${moment().startOf('month').format('YYYY-MM-DD')}' && h.TanggalTransaksi <= '${moment().endOf('month').format('YYYY-MM-DD')}';`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    daftarProdukTerbaik: (req, res) => {
        var sql = `SELECT namaPaket, SUM(Durasi * JumlahBox) as totalTerjual, COUNT(hd.idHistory) as jumlahTransaksi
                    FROM history_detailproduct hd
                    JOIN history h
                    JOIN kategori_langganan kl
                    on h.id = hd.idHistory && kl.id = hd.idPaket
                    WHERE h.Status = 'PAID OFF' 
                    && h.TanggalTransaksi >= '${moment().startOf('month').format('YYYY-MM-DD')}' && h.TanggalTransaksi <= '${moment().endOf('month').format('YYYY-MM-DD')}'
                    GROUP BY namaPaket
                    ORDER BY totalTerjual DESC;`

        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    daftarUserTerbaik: (req, res) => {
        var sql = `SELECT u.username, h.UserId, SUM(h.TotalBelanja) as TotalBelanjaan, COUNT(h.UserId) as JumlahTransaksi
                    FROM history h
                    JOIN users u
                    on h.UserId = u.id
                    WHERE h.Status = 'PAID OFF' 
                    && h.TanggalTransaksi >= '${moment().startOf('month').format('YYYY-MM-DD')}' && h.TanggalTransaksi <= '${moment().endOf('month').format('YYYY-MM-DD')}'
                    GROUP BY UserId
                    ORDER BY TotalBelanjaan DESC;`
                    
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    }
}


