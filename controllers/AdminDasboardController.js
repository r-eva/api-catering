const { sqlDB } = require('../database')
const fs = require('fs')

module.exports = {
    getTransaksiMenunggu: (req, res) => {
        var sql = `SELECT h.id, u.username, h.TanggalTransaksi,
                    h.UserId, h.TotalBelanja,
                    h.buktiPembayaranPath 
                    FROM history h
                    JOIN users u
                    on h.UserId = u.id
                    WHERE h.Status = 'Waiting for Admin Confirmation'`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
                }
                res.status(200).send(result)
            })
    },
    confirmPembayaran: (req, res) => {
        var sql = `SELECT buktiPembayaranPath FROM history WHERE id = ${req.body.idHistory};`
        sqlDB.query(sql, (err, results) => {
            if(err) {
                return res.status(500).send({message: `Gagal menambah jadwal`, err})
            }

            if (req.body.statusImage === 'exist') {
                // fs.unlinkSync('./public' + results[0].buktiPembayaranPath)
                var sql =  `UPDATE history SET Status="PAID OFF" WHERE id=${req.body.idHistory};`
                sqlDB.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                res.status(200).send(result)
                })
            } else {
                var sql =  `UPDATE history SET Status="PAID OFF" WHERE id=${req.body.idHistory};`
                sqlDB.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                res.status(200).send(result)
                })
            }
        })
    },
    rejectPembayaran: (req, res) => {
        var sql = `SELECT buktiPembayaranPath FROM history WHERE id = ${req.body.idHistory};`
        sqlDB.query(sql, (err, results) => {
            if(err) {
                return res.status(500).send({message: `Gagal menambah jadwal`, err})
            }

            if (req.body.statusImage === 'exist') {
                // fs.unlinkSync('./public' + results[0].buktiPembayaranPath)
                var sql =  `UPDATE history SET Status="REJECT BY ADMIN" WHERE id=${req.body.idHistory};`
                sqlDB.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    res.status(200).send(result)
                })
            } else {
                var sql =  `UPDATE history SET Status="REJECT BY ADMIN" WHERE id=${req.body.idHistory};`
                sqlDB.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    res.status(200).send(result)
                })
            }
        })
    }
}