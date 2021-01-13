const { sqlDB } = require('../database')

module.exports = {
    getWishListByIdUser:(req, res) => {
        var sql = `SELECT
                    w.id, w.idUser, w.idPaket, kl.namaPaket,
                    kl.harga, kl.imagePath, kl.discount
                    FROM wishlist w
                    JOIN kategori_langganan kl
                    ON w.idPaket = kl.id
                    WHERE w.idUser = ${sqlDB.escape(req.params.id)};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    getWishListByIdUserPaket:(req, res) => {
        var sql = `SELECT
                    w.id, w.idUser, w.idPaket, kl.namaPaket
                    FROM wishlist w
                    JOIN kategori_langganan kl
                    ON w.idPaket = kl.id
                    WHERE w.idUser = ${sqlDB.escape(req.body.idUser)} && w.idPaket = ${sqlDB.escape(req.body.idPaket)};`
        sqlDB.query(sql, (err, result) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    deleteWishlistById: (req, res) => {
        var sql = `DELETE from wishlist where id=${sqlDB.escape(req.params.id)}`
        sqlDB.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    addToWishlist: (req, res) => {
        var sql = `INSERT INTO wishlist SET ?;`
        sqlDB.query(sql, [req.body], (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    }
}