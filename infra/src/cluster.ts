import * as awsx from '@pulumi/awsx'

export const eCSCluster = new awsx.classic.ecs.Cluster('app-cluster')
