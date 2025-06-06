import '../broker/subscriber.ts'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.get('/health', () => {
  return 'OK'
})

server.listen({ host: '0.0.0.0', port: 3001 }, () => {
  console.log('[Invoices] HTTP Server running!')
})
