const { app, path } = require("./plugins")

//environment variables
require("dotenv").config()

//register npm modules/plugins
app.register(require("fastify-helmet"),  { 
    contentSecurityPolicy: false
    // {
    //   directives: {
    //     defaultSrc: ["'self'"],
    //     scriptSrc: ["'self'", "https://www.google.com/recaptcha/api.js?render=6LfWRMQbAAAAAG0QCV3Blkn1lFuPB64l-zjYnRmU"],
    //   }
    // }
  })
// app.register(require("fastify-multipart"))
app.register(require("fastify-cors"), {
    origin:
        process.env.NODE_ENV === "development"
            ? ["http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://localhost:4000"]
            : ["https://www.orbrift.com", "https://orbrift.com"],
})

//register global app hooks and plugins
// app.register(require("./globalHooks/AuthorizationHooks"), {})

// Declare static routes
app.register(require("fastify-static"), {
    root: path.join(__dirname, "public"),
})

// app.register(require("fastify-static"), {
//     root: path.join(__dirname, "uploads/images/"),
//     prefix: "/img/",
//     // prefix: /^(\d{2,3})_(\d{1})/,
//     decorateReply: false,
// })

//Import all the app's processed Api route functions
app.register(require("./processors"))

//Start the server
const start = async () => {
    try {
        // await app.listen(process.env.PORT, process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1')
        await app.listen(process.env.PORT, process.env.HOST).then(() => {

        })
        // app.log.info(`server listening on ${ app.server.address().port }`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
