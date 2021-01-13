const { sqlDB } = require('../database')
const { uploader } = require('../helpers/uploader')
const fs = require('fs')

module.exports = {
    addToHistory: (req, res) => {
        var historyTambahan = req.body
        if (historyTambahan) {
            var sql = `INSERT INTO history SET ?;`
            sqlDB.query(sql, historyTambahan, (err, result) => {
                if(err) {
                    return res.status(500).send(err)
                }

                var idHistorySubmit = result.insertId
        
                var sql = `SELECT * FROM cart WHERE idUser = ${sqlDB.escape(req.body.UserId)};`
                sqlDB.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).send(err)
                    }
                    var insertdata = []
                    for (i = 0; i < result.length; i++) {
                        insertdata.push([result[i].idUser, result[i].idPaket, result[i].TanggalMulai,
                                        result[i].TanggalBerakhir, result[i].Durasi,
                                        result[i].JumlahBox, idHistorySubmit])
                    }
                   
                    sql = `INSERT INTO history_detailproduct (idUser, idPaket,
                            TanggalMulai, TanggalBerakhir, Durasi, JumlahBox, idHistory) VALUES ?`
                    sqlDB.query(sql, [insertdata], (err, results) => {
                        if (err) {
                            return res.status(500).send(err)
                        } 
        
                        sql = `SELECT * FROM history WHERE id = ${idHistorySubmit}`
                        sqlDB.query(sql, (err, result4) => {
                            if (err) {
                                return res.status(500).send(err)
                            }  
        
                            sql = `CREATE EVENT event${result4[0].id}
                            ON SCHEDULE AT (select DATE_ADD(now(),interval 1 hour))
                            DO UPDATE history SET Cancel=1 , Status="Canceled By System" WHERE id=${result4[0].id};`
                            sqlDB.query(sql, (err, results3) => {
                                if (err) {
                                    return res.status(500).send(err)
                                } 
                                
                                var sql = `DELETE from cart where idUser=${req.body.UserId}`
                                sqlDB.query(sql,(err,result)=>{
                                    if(err){
                                        return res.status(500).send(err)
                                    }
                                    res.status(200).send(result)
                                })
                            })
                        })
                    })
                })

            })
        } else {
            res.status(500).send('Tolong isi query history!')
        }
    },
    getHistoryByIdUser: (req, res) => {
        var sql = `SELECT * from history
                    WHERE UserId = ${sqlDB.escape(req.params.id)};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    getHistoryDetailById: (req, res) => {
        var sql = `SELECT kl.namaPaket, kl.harga, kl.discount, hd.JumlahBox,
                    hd.TanggalMulai, hd.TanggalBerakhir, hd.Durasi,
                    hd.id as id, h.id as idHistory, h.TotalBelanja,
                    h.NamaPenerima, h.AlamatPenerima, h.KodePosPenerima
                    FROM history_detailproduct hd
                    JOIN kategori_langganan kl
                    JOIN history h
                    on hd.idPaket = kl.id && h.id = hd.idHistory
                    WHERE idHistory = ${req.params.id};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    cancelHistoryByIdHistory: (req, res) => {
        var sql = `UPDATE history SET Cancel=1 , Status="Canceled By User" WHERE id=${req.params.id};
                    DROP EVENT event${req.params.id};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    uploadBuktiPembayaran: (req,res) => {
        const path = '/images/buktipembayaran';
        const upload = uploader(path, 'TOK').fields([{ name: 'image' }]);
    
        upload(req, res, (err) => {
            if(err){
                return res.status(500).json({ message: 'Upload file failed !', error: err.message });
            }
            const { image } = req.files
            var sql = `UPDATE history SET buktiPembayaranPath = "${path}/${image[0].filename}" WHERE id = ${req.params.id}`;
            sqlDB.query(sql, (err, result) => {
                if(err) {
                    fs.unlinkSync('./public' + path + '/' + image[0].filename)
                    return res.status(500).send(err)
                }
                return res.status(200).send(result)
            })

        })
    },
    pembayaranSubmit: (req, res) => {
        var sql =  `UPDATE history SET Status="Waiting for Admin Confirmation" WHERE id=${req.params.id};
        DROP EVENT event${req.params.id};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    }
}