const express = require('express')
const { auth } = require('../helpers/auth')
const { userController } = require('../controllers')

const router = express.Router()

router.post('/register', userController.register)
router.post('/confirmemail', userController.confirmEmail)
router.get('/confirmedEmailOtherScreen/:email', userController.confirmedEmailOtherScreen)
router.post('/resendemailconfirm', userController.resendEmailConfirm)
router.post('/login', userController.login)
router.post('/keeplogin', auth, userController.keepLogin)
router.get('/getAllUsers', userController.getAllUserData)
router.get('/userDashboard/:email', userController.userDashboard)
router.post('/loginbyfacebook', userController.loginByFacebook)

module.exports = router
