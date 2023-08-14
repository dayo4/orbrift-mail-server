const reCaptcha = require("./reCaptcha")
const sanitizeHTML = require("sanitize-html")

// Some other frequently used plugins and modules
const path = require("path")
const fsx = require("fs-extra")

//some utils functions
const hlp = require("./helpers")
const corsHandler = require("./cors")

module.exports = {
    reCaptcha,
    sanitizeHTML,
    fsx,
    path,
    //
    hlp,
    corsHandler
}