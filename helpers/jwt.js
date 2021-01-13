const jwt = require('jsonwebtoken')

module.exports = {
    createJWTToken: (data) => {
        return jwt.sign(data, 'tlogosari', {expiresIn: '1hr'})
    }
}