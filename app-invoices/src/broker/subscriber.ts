import { orders } from './channels/orders.ts'

orders.consume(
  'orders',
  (message) => {
    if (!message) {
      return null
    }

    console.log('[Invoices] Order created:', message.content.toString())

    orders.ack(message)
  },
  { noAck: true },
)
