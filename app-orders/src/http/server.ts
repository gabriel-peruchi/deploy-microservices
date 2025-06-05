import crypto from 'node:crypto'
import { fastify } from 'fastify'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { z } from 'zod'
import { dispacthOrderCreated } from '../broker/messages/order-created.ts'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'

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
  async (request, reply) => {
    const { amount } = request.body

    const orderId = crypto.randomUUID()
    const customerId = '4950052d-b351-4ba6-9c8a-85d1de2d9b12'

    await db.insert(schema.orders).values({
      id: orderId,
      amount,
      customerId,
    })

    dispacthOrderCreated({
      orderId,
      amount,
      customer: {
        id: customerId,
      },
    })

    return reply.status(200).send()
  },
)

server.listen({ host: '0.0.0.0', port: 3000 }, () => {
  console.log('[Orders] HTTP Server running!')
})
