const express = require('express')
const {WishlistController} = require('../controllers')

const router = express.Router()

router.post('/getWishListByIdUserPaket/', WishlistController.getWishListByIdUserPaket)
router.post('/addToWishlist/', WishlistController.addToWishlist)
router.delete('/deleteWishlistById/:id', WishlistController.deleteWishlistById)
router.get('/getWishlistByIdUser/:id', WishlistController.getWishListByIdUser)

module.exports = router