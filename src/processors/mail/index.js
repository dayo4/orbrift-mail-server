const Mail = require('./Services')

module.exports = async (app, options) => {

    app.post('/sendMail', Mail.send)
    app.post('/sendProjectEnq', Mail.sendProjectEnq)
}
