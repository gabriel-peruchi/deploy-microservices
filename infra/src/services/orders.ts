import * as awsx from '@pulumi/awsx'

import { eCSCluster } from '../cluster'
import { ordersDockerImage } from '../images/orders'
import { appLoadBalancer } from '../load-balancer'
import { amqpListener } from './rabbitmq'

const ordersTargetGroup = appLoadBalancer.createTargetGroup(
  'orders-admin-target',
  {
    port: 3000,
    protocol: 'HTTP',
    healthCheck: {
      path: '/health',
      protocol: 'HTTP',
    },
  },
)

export const ordersHttpListener = appLoadBalancer.createListener(
  'orders-admin-listener',
  {
    port: 3000,
    protocol: 'HTTP',
    targetGroup: ordersTargetGroup,
  },
)

export const ordersService = new awsx.classic.ecs.FargateService(
  'fargate-orders',
  {
    cluster: eCSCluster,
    desiredCount: 1, // Minimum number of tasks to run
    waitForSteadyState: false, // Do not wait for the service to reach a steady state (torce pra dar certo)
    taskDefinitionArgs: {
      container: {
        image: ordersDockerImage.ref,
        cpu: 256,
        memory: 512,
        portMappings: [ordersHttpListener],
        environment: [
          {
            name: 'BROKER_URL',
            value: `amqp://admin:admin@${amqpListener.endpoint.hostname}:${amqpListener.endpoint.port}`,
          },
          {
            name: 'DATABASE_URL',
            value: '<your-database-url>',
          },
        ],
      },
    },
  },
)
