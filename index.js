//rest api with fastify framework
const routes = require('./routes/Route')//call routes files
// const Address = require('./models/Address')
// const Coordinate = require('./models/Cordinates')
 
 // Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

// Declare a route
routes.forEach((route, index) => {
  fastify.route(route)
})
 
//fastify cors ile browser'da istek atma izni alınır
  fastify.register(require("fastify-cors"), {
    origin: "*",
    methods: ["POST","GET"]
  });
  

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start();
fastify.listen(3000);


