const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

module.exports = {
    getConnection: (res) => {
        io.on('connection', (socket) => {
            res.status(200).send(console.log('a user connected'));
            socket.on('disconnect', () => {
                res.status(200).send(console.log('a user connected'));
            });
        });
    }
}