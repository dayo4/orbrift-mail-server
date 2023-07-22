const { app, path } = require("./plugins")


//environment variables
require("dotenv").config()

//register npm modules/plugins
app.register(require("fastify-helmet"))

// app.register(require("fastify-multipart"))
app.register(require("fastify-cors"), {
    origin:
        process.env.NODE_ENV === "development"
            ? ["http://localhost:8080", "http://localhost:8081", "http://127.0.0.1:8080", "http://localhost:4000"]
            : ["https://www.orbrift.com", "https://orbrift.com"],
})

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
    console.log("running")
    try {
        await app.listen(process.env.PORT, process.env.HOST).then(() => {
            // http.get('http://127.0.0.1:3000/', (res) => {
            //     console.log(res.headers['cache-control'])
            //   })
        })
        app.log.info(`server listening on ${ app.server.address().port }`)
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}
start()
