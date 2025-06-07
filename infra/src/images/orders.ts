import * as aws from '@pulumi/aws'
import * as awsx from '@pulumi/awsx'
import * as docker from '@pulumi/docker-build'
import * as pulumi from '@pulumi/pulumi'

const ordersECRRepository = new awsx.ecr.Repository('orders-ecr', {
  forceDelete: true, // Ensures the repository is deleted even if it contains images
})

const ordersECRToken = aws.ecr.getAuthorizationTokenOutput({
  registryId: ordersECRRepository.repository.registryId,
})

export const ordersDockerImage = new docker.Image('orders-image', {
  tags: [
    pulumi.interpolate`${ordersECRRepository.repository.repositoryUrl}:latest`,
  ],
  context: {
    location: '../app-orders',
  },
  push: true, // Build and push the image to the ECR repository
  platforms: ['linux/amd64'],
  registries: [
    {
      address: ordersECRRepository.repository.repositoryUrl,
      username: ordersECRToken.userName,
      password: ordersECRToken.password,
    },
  ],
})
