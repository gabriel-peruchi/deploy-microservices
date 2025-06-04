import Fastify from 'fastify'

const server = Fastify()

server.listen({ port: 3000 }, () => {
  console.log('app-orders is running on http://localhost:3000')
})
