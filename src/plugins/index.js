const app = require("./fastify")
const reCaptcha = require("./reCaptcha")
const sanitizeHTML = require("sanitize-html")

// Some other frequently used plugins and modules
const path = require("path")

//some utils functions
const hlp = require("./helpers")

module.exports = {
    app,
    reCaptcha,
    sanitizeHTML,
    path,
    //
    hlp,
}