const app = require('./fastify')

const mailErrorMsg = 'Sorry! Encountered mail service connection error. Please try again later'
module.exports = {

    error (error, code) {
        if (error && typeof error !== 'string')
        {
            const err = new Error(error)
            err.message = error.message.indexOf('getaddrinfo') != -1 ? mailErrorMsg : error.message
            if (code)
                err.statusCode = code
            else
                err.statusCode = error.statusCode
            app.log.error(err)
            throw err
        }
        else
        {
            const err = new Error()
            if (error)
            {
                err.message = error
            }
            if (code)
                err.statusCode = code

            app.log.error(err)
            throw err
        }


    }
}