const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourdailycatering@gmail.com',
        pass: 'sjrttgicgobnxokj'
    },
    tls: {
        rejectUnautorized: false
    }
})

module.exports = {
    transporter
};