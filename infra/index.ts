import * as pulumi from '@pulumi/pulumi'

import { appLoadBalancer } from './src/load-balancer'
import { ordersService } from './src/services/orders'

export const ordersId = ordersService.service.id
export const rabbitMQId = ordersService.service.id
export const rabbitMQAdminUrl = pulumi.interpolate`http://${appLoadBalancer.listeners[0].endpoint.hostname}:15672/`
