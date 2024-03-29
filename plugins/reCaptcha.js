require('dotenv').config()
var fetch = require('node-fetch')

module.exports = {
    async verifyCaptchaToken(token) {
        const url = `secret=${process.env.CAPTCHER_SECRET_KEY}&response=${token}`
        try {
            return fetch("https://www.google.com/recaptcha/api/siteverify?" + url,
                { method: 'POST' }
            )
                .then((response) => response.json())
                .then((data) => {
                    return data
                })
                .catch((e) => {
                    return e
                })
        } catch (e) {
            throw new Error(e)
        }
    }
}