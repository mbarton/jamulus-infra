# jamulus-infra

## Run in AWS

- Go to Cloudformation in the AWS console
- Create a new stack, uploading `cloudformation.yaml` from here as the template

To find the IP address to connect to:

- Go to ECS in the AWS console
- Click "Clusters", then click the Jamulus cluster
- Click "Tasks", then click the only task in the list
- The IP address to connect to is on that under, under "Public IP"

## To modify the template

- `nvm use`
- `npm i`
- `npm synth`

## TODO:

- Add EC2 backed instances
- Add a CFN parameter to toggle running or not