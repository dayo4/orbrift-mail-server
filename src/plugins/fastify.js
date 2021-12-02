
/* The fastify framework */
const app = require('fastify')({
    logger: true
    // logger:
    // {
    //     // level: 'error',
    //     // customLevel: [ 'error' ],
    //     file: 'logs/logs'
    // }
})

module.exports = app