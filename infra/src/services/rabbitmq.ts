import * as awsx from '@pulumi/awsx'

import { eCSCluster } from '../cluster'
import { appLoadBalancer, networkLoadBalancer } from '../load-balancer'

const rabbitMQAdminTargetGroup = appLoadBalancer.createTargetGroup(
  'rabbitmq-admin-target',
  {
    port: 15672, // RabbitMQ management plugin port
    protocol: 'HTTP',
    healthCheck: {
      path: '/',
      protocol: 'HTTP',
    },
  },
)

export const rabbitMQAdminHttpListener = appLoadBalancer.createListener(
  'rabbitmq-admin-listener',
  {
    port: 15672, // RabbitMQ management plugin port
    protocol: 'HTTP',
    targetGroup: rabbitMQAdminTargetGroup,
  },
)

const amqpTargetGroup = networkLoadBalancer.createTargetGroup('amqp-target', {
  port: 5672, // RabbitMQ AMQP port
  protocol: 'TCP',
  targetType: 'ip', // Use IP target type for Fargate
  healthCheck: {
    protocol: 'TCP',
    port: '5672', // Health check on the AMQP port
  },
})

export const amqpListener = networkLoadBalancer.createListener(
  'amqp-listener',
  {
    port: 5672, // RabbitMQ AMQP port
    protocol: 'TCP',
    targetGroup: amqpTargetGroup,
  },
)

export const rabbitMQService = new awsx.classic.ecs.FargateService(
  'fargate-rabbitmq',
  {
    cluster: eCSCluster,
    desiredCount: 1, // Minimum number of tasks to run
    waitForSteadyState: false, // Do not wait for the service to reach a steady state (torce pra dar certo)
    taskDefinitionArgs: {
      container: {
        image: 'rabbitmq:3-management', // Using the official RabbitMQ image with management plugin
        cpu: 256,
        memory: 512,
        portMappings: [rabbitMQAdminHttpListener, amqpListener],
        environment: [
          { name: 'RABBITMQ_DEFAULT_USER', value: 'admin' },
          { name: 'RABBITMQ_DEFAULT_PASS', value: 'admin' },
        ],
      },
    },
  },
)
