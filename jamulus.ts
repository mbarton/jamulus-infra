import { App, Stack, Construct } from '@aws-cdk/core';
import { Cluster, TaskDefinition, Compatibility, RepositoryImage, FargateService, LogDrivers } from '@aws-cdk/aws-ecs';
import { SecurityGroup, Peer, Port, Vpc, SubnetType } from '@aws-cdk/aws-ec2';

class Jamulus extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        // We don't need anything other than a simple VPC with a single subnet
        // This saves time at creation and also money, as it won't create NAT gateways between public/private
        const vpc = new Vpc(this, 'Vpc', {
            cidr: '10.0.0.0/16',
            maxAzs: 1,
            natGateways: 0,
            subnetConfiguration: [
                {
                    name: 'Jamulus',
                    subnetType: SubnetType.PUBLIC
                }
            ]
        });

        const cluster = new Cluster(this, 'Cluster', { vpc });

        // Only applies when running in Fargate
        // https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html
        const cpu = 2048;
        const memory = 4096;

        const taskDefinition = new TaskDefinition(this, 'TaskDefinition', {
            compatibility: Compatibility.EC2_AND_FARGATE,
            cpu: '' + cpu,
            memoryMiB: '' + memory
        });

        taskDefinition.addContainer('Jamulus', {
            image: new RepositoryImage('grundic/jamulus'),
            entryPoint: ['Jamulus','--server','--nogui'],
            cpu,
            memoryLimitMiB: memory,
            logging: LogDrivers.awsLogs({ streamPrefix: 'Jamulus' })
        });

        const securityGroup = new SecurityGroup(this, 'Security Group', {
            vpc: cluster.vpc
        });

        securityGroup.addIngressRule(Peer.anyIpv4(), Port.udp(22124));

        const service = new FargateService(this, 'Service', {
            cluster,
            taskDefinition,
            assignPublicIp: true,
            desiredCount: 1,
            securityGroups: [securityGroup]
        });
    }
}

const app = new App();
const stack = new Jamulus(app, "Jamulus");