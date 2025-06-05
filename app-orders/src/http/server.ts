import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { z } from 'zod'

const server = fastify().withTypeProvider<ZodTypeProvider>()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.get('/health', () => {
  return 'OK'
})

server.post(
  '/orders',
  {
    schema: {
      body: z.object({
        amount: z.number(),
      }),
    },
  },
  (request, reply) => {
    const { amount } = request.body
    console.log(`Received order with amount: ${amount}`)
    return reply.status(200).send()
  },
)

server.listen({ host: '0.0.0.0', port: 3000 }, () => {
  console.log('[Orders] HTTP Server running!')
})
