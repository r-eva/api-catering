const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bearerToken = require('express-bearer-token')

const app = express()

/////////////////////////////////////SOCKET IO////////////////////////////////////////////////////
const http = require('http').createServer(app)
const io = require('socket.io')(http);

/////////////////////////////////////SOCKET IO////////////////////////////////////////////////////
const port = process.env.PORT || 1997

// //////////////////////////////////MIDDLEWARE////////////////////////////////////////////////////
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bearerToken())
app.use(cors())
app.use(express.static('public'))

//////////////////////////////////SOCKET IO/////////////////////////////////////////////////////

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//     });
// });

// /////////////////////////////// MASUK API ///////////////////////////////////////////////////

app.get('/', (req, res) => {
    res.status(200).send('<h1 style="color:#D2691E;text-align:center; padding: 10px">Welcome to API CHEW & CHEERS</h1>')
})

const { userRouter, langgananRouter,
        jadwalRouter, cartRouter,
        historyRouter, adminDasboardRouter,
        jadwalAdminRouter, pesananRouter, wishlistRouter, messageRouter } = require('./routers')

app.use('/user', userRouter)
app.use('/langganan', langgananRouter)
app.use('/jadwal', jadwalRouter)
app.use('/cart', cartRouter)
app.use('/history', historyRouter)
app.use('/admin', adminDasboardRouter)
app.use('/jadwalAdmin', jadwalAdminRouter)
app.use('/pesanan', pesananRouter)
app.use('/wishlist', wishlistRouter)
app.use('/message', messageRouter)

http.listen(port, () => console.log(`API aktif di port ${port}`))