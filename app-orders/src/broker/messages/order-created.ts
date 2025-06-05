import { channels } from '../channels/index.ts'
import { OrderCreatedMessage } from './../../../../contracts/messages/order-created-message.ts'

export function dispacthOrderCreated(data: OrderCreatedMessage) {
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}
