const { fsx } = require("../plugins")

const apiRoutes = async (app, options) => {
	/* Register all processed Api routes, hooks and services */
	app.register(require("./mail"), { prefix: "rift-v1" })

	app.setNotFoundHandler(async (req, reply) => {
		if (await fsx.pathExists(req.url + '/index.html'))
			reply.sendFile(req.url + '/index.html')
		reply.sendFile('index.html')
	})

	app.get('/dd', async (req, reply) => {
	    await reply.sendFile('index.html')
	})

	// app.get('*', async (req, reply) => {
	//     await reply.sendFile('index.html')
	// })
}

module.exports = apiRoutes
