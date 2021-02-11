import { App, Stack, Construct } from '@aws-cdk/core';
import { Cluster, TaskDefinition, Compatibility, RepositoryImage, FargateService } from '@aws-cdk/aws-ecs';
import { SecurityGroup, Peer, Port } from '@aws-cdk/aws-ec2';

class Jamulus extends Stack {
    constructor(scope: Construct, id: string) {
        super(scope, id);

        const cluster = new Cluster(this, 'Cluster');

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
            memoryLimitMiB: memory
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