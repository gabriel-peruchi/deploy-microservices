import { channels } from '../channels/index.ts'

export function dispacthOrderCreated(data: any) {
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}
