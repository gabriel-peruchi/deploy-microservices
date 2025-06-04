import Fastify from 'fastify'

const server = Fastify()

server.listen({ port: 3001 }, () => {
  console.log('app-invoices is running on http://localhost:3001')
})
