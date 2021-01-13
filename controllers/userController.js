const crypto = require('crypto')
const { sqlDB } = require('../database')
const { createJWTToken } = require('../helpers/jwt')
const { transporter } = require('../helpers/mailer')

const secret = 'passwordcrypted'

module.exports = {
    register: (req, res) => {
        req.body.status = 'Unverified'
        req.body.tanggalBergabung = new Date()
    
        req.body.password = crypto.createHmac('sha256', secret)
            .update(req.body.password)
            .digest('hex')

        var mykey = crypto.createCipher('aes-128-cbc', secret);
        var emailVerification = mykey.update(req.body.email, 'utf8', 'hex')
        emailVerification += mykey.final('hex');

        var sql = `SELECT * FROM users WHERE email = '${req.body.email}';`
        sqlDB.query(sql, (err, result) => {
            if (err) return res.status(500).send({message: `Database Error`, err, error: true})
            if (result.length > 0) {
                return res.status(500).send({message: `Email has been taken!`, err, error: true})
            } else {
                sql = `INSERT INTO users SET ?;`
                sqlDB.query(sql, req.body, (err, result) => {
                    if (err) return res.status(500).send({message: `Database Error`, err, error: true})
                    var mailOption = {
                        from: `CHEW and CHEER Your Daily Catering <reginaevadewi@gmail.com>`,
                        to: req.body.email,
                        subject: 'Email Verification',
                        html: `Verify your email by clicking this link 
                            <a href="http://customer-catering.herokuapp.com/emailverified?email=${emailVerification}">Verification</a>`
                    }
            
                    transporter.sendMail(mailOption, (err, result) => {
                        if (err) return res.status(500).send({message: 'Send Email Failed!', err, error: false, email: emailVerification})
                        res.status(200).send({status: 'Send Email Success!', result, email: emailVerification})
                    })
                })
            }
        })
    },
    confirmEmail: (req, res) => {
        var mykey = crypto.createDecipher('aes-128-cbc', secret);
        var bukaEmail = mykey.update(req.body.email, 'hex', 'utf8')
        bukaEmail += mykey.final('utf8')

        var sql = `UPDATE users SET status='Verified' WHERE email='${bukaEmail}';`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send({status: 'error', err})
            sql = `SELECT id, username, email, status, role from users WHERE email = '${bukaEmail}'`
            sqlDB.query(sql, (err, results) => {
                if (err) return res.status(500).send({err})
                var token = createJWTToken({...results[0]})
                res.status(200).send({...results[0], token})
            })
        })
    }, 
    confirmedEmailOtherScreen: (req, res) => {
        sql = `SELECT id, username, email, status, role from users WHERE email = ${sqlDB.escape(req.params.email)}`
        sqlDB.query(sql, (err, results) => {
            if (err) return res.status(500).send({err})
            var token = createJWTToken({...results[0]})
            res.status(200).send({...results[0], token})
        })
        
    },
    resendEmailConfirm: (req, res) => {
       var mykey = crypto.createDecipher('aes-128-cbc', secret);
        var bukaEmail = mykey.update(req.body.email, 'hex', 'utf8')
        bukaEmail += mykey.final('utf8')

        var mailOption = {
            from: "CHEW and CHEER Your Daily Catering <reginaevadewi@gmail.com>",
            to: bukaEmail,
            subject: 'Email Verification',
            html: `Please verify your email by clicking this link
            <a href="http://customer-catering.herokuapp.com/emailverified?email=${req.body.email}">Verified<a/>`
        }
    
        transporter.sendMail(mailOption, (err, result) => {
            if (err) return res.status(500).send({message: 'Send verification email failed!', err})
            res.status(200).send({message: 'Send verification email success.', result})
        })
    }, 
    login: (req, res) => {
        var { email, password } = req.body
        password = crypto.createHmac('sha256', secret)
            .update(password)
            .digest('hex')
        
        var sql = `SELECT id, password, username, email, status, role FROM users WHERE email = ${sqlDB.escape(email)}
                    AND password = ${sqlDB.escape(password)}`

        sqlDB.query(sql, (err, result) => {
            if (err) return res.status(500).send({message: 'Database Error!', err})
            if (result.length === 0) {
                return res.status(500).send({message: 'Wrong username or password!'})
            }

            var mykey = crypto.createCipher('aes-128-cbc', secret);
                var emailCode = mykey.update(email, 'utf8', 'hex')
                emailCode += mykey.final('hex')

            var token = createJWTToken({...result[0], encryptedEmail: emailCode})
            if (result[0].status === 'Unverified') {
                res.status(200).send({...result[0], token, encryptedEmail: emailCode})
            } else {
                res.status(200).send({...result[0], token})
            }
        })
    },
    keepLogin: (req, res) => {
        return res.status(200).send({...req.user, token: req.token})
    },
    getAllUserData: (req, res) => {
        var sql = `SELECT id, username, email, status, tanggalBergabung, role from users;`
        sqlDB.query(sql,(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            res.status(200).send(result)
        })
    },
    userDashboard: (req, res) => {
        var mykey = crypto.createCipher('aes-128-cbc', secret);
        var emailVerification = mykey.update(req.params.email, 'utf8', 'hex')
        emailVerification += mykey.final('hex')
        res.status(200).send(emailVerification)
    },
    loginByFacebook: (req, res) => {
        req.body.status = 'Verified'
        req.body.tanggalBergabung = new Date()
        req.body.role = 'user'
        var sql = `SELECT id, password, username, email, status, role FROM users WHERE email = ${sqlDB.escape(req.body.email)}
                    AND username = ${sqlDB.escape(req.body.username)}`

        sqlDB.query(sql, (err, result) => {
            if (err) return res.status(500).send(err)
            if (result.length === 0) { 
                sql = `INSERT INTO users SET ?;`
                sqlDB.query(sql, req.body, (err, result1) => {
                    if (err) return res.status(500).send({message: `Database Error`, err, error: true})
                    sql = `SELECT id, username, email, status, role from users WHERE id = '${result1.insertId}'`
                    sqlDB.query(sql, (err, results2) => {
                        if (err) return res.status(500).send({err})
                        var token = createJWTToken({...results2[0]})
                        res.status(200).send({...results2[0], token})
                    })
                })
            } else {
                var token = createJWTToken({...result[0]})
                res.status(200).send({...result[0], token})
            }
            
        })
    }
}
