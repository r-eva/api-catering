const { sqlDB } = require('../database')

module.exports = {
    addToCart: (req, res) => {
        var cartTambahan = req.body
        if (cartTambahan) {
            var sql = `INSERT INTO cart SET ?;`
            sqlDB.query(sql, [cartTambahan], (err, results) => {
                if(err) {
                    return res.status(500).send(err)
                }
                sql = `SELECT * from cart;`
                sqlDB.query(sql, (err, results) => {
                    if(err) return res.status(500).send(err)
                    res.status(200).send(results)
                })
            })
        } else {
            res.status(500).send('Tolong isi query kategori tambahan!')
        }
    },
    getCartByIdUser:(req, res) => {
        var sql = `SELECT
                    c.id, c.idUser, kl.namaPaket, c.TanggalMulai, c.TanggalBerakhir,
                    c.Durasi, c.JumlahBox, kl.harga, kl.discount, c.idPaket
                    FROM cart c
                    JOIN kategori_langganan kl
                    ON c.idPaket = kl.id
                    WHERE idUser = ${sqlDB.escape(req.params.id)};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    editCart: (req, res) => {
        var data = req.body
        var sql = `UPDATE cart SET ? WHERE id = ${req.params.id}`
        sqlDB.query(sql, data, (err, result) => {
            if (err) {
                return res.status(500).send(err)
                } 
                res.status(200).send(result)
            })
    },
    deleteCartById: (req, res) => {
        var sql = `DELETE from cart where id=${sqlDB.escape(req.params.id)}`
        sqlDB.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    }
}