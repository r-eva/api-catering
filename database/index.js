const mysql = require('mysql')

const db = mysql.createConnection({
    host: '****',
    user: '****',
    password: '****',
    database: '****',
    port: 3306,
    multipleStatements: true
})

module.exports = {
    sqlDB: db
}