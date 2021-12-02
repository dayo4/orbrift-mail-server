const apiRoutes = async (app, options) => {
	/* Register all processed Api routes, hooks and services */
	app.register(require("./mail"), {prefix: "rift-v1"})

	app.setNotFoundHandler(async (req, reply) => {
		await reply.sendFile("index.html")
	})

	// app.get('*', async (req, reply) => {
	//     await reply.sendFile('index.html')
	// })
}

module.exports = apiRoutes
