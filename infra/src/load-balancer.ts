import * as awsx from '@pulumi/awsx'
import { eCSCluster } from './cluster'

export const appLoadBalancer = new awsx.classic.lb.ApplicationLoadBalancer(
  'app-lb',
  {
    securityGroups: eCSCluster.securityGroups,
  },
)

export const networkLoadBalancer = new awsx.classic.lb.NetworkLoadBalancer(
  'app-lb',
  {
    subnets: eCSCluster.vpc.privateSubnetIds,
  },
)
