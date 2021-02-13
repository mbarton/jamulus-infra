# jamulus-infra

## A note on packaging

Many OSs have pre-built packages for Jamulus: https://repology.org/project/jamulus/versions.

Debian would be ideal. It's very widely deployed and is the basis for Ubuntu so lots of online tutorials also apply.
The downside is that they only package it in their "Testing" distribution (the beta for their next release) and they don't seem to publish
official Amazon VM images (AMIs) of that stream. We [don't have long to wait](https://wiki.debian.org/DebianBullseye#Debian_Bullseye_Life_cycle)
for it to be released and become the "Stable" distribution, but in the meantime I want to avoid having anything in this example that means
having to maintain our own AMIs.

OpenSUSE Tumbleweed would also be a fine choice, but I've never really used SUSE before.

So I decided to go with FreeBSD. It's not Linux, but then neither is MacOS and people still get work done on those. It's also not really
changed much since 1993 so must be good, and I get swag points for using something rare and unusual. Jamulus is packaged up
as a [FreeBSD port](https://www.freebsd.org/ports/) which have a decent reputation for being kept up to date and not randomly breaking.

## Run in AWS

- [Create an SSH key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair) that you
will use if you ever need to access the instance
  - Make sure to choose the correct format if you are using PuTTY on Windows
- Go to the Cloudformation page in AWS
- Click "Create Stack"
- Click "Upload Template File" and choose `cloudformation-ec2.yaml` from this repository. Then click "Next".
- Fill in the parameters:
  - Stack Name: `jamulus` (you can pick anything you like)
  - `SSHKeyPair` - pick the one you just created from the drop-down
  - `VpcId` - pick the only option from the drop-down (your [default VPC](https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html))
  - `SubnetAZXId` - fill each one of these in with separate entries from the drop-downs (there will be 3 entries in total)
- Click "Next" twice, then "Create"
- Once it says the stack has been created, click the "Resources" tab
- Click on the link next to "AutoScalingGroup"
- On the AutoScalingGroup page, click "Instance management", then click the link to the instance in the table (it'll start with `i-`)
- On the instance page, you can find the IP address to connect to under "Public IPv4 address"

## SSH to your instance

To SSH into your instance, find the public IP address using the instructions above.

On the macOS or Linux command line:

```
ssh ec2-user@<IP_ADDRESS> -i <path to the private key you downloaded when you created the key pair>
```

In PuTTY, set the username as `ec2-user` and the host as 

## Notes

Beware [burstable](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html) AWS instance types (including Lightsail) when running Jamulus, as the CPU usage should be relatively constant during a session rather than peaky like a web server.

TODO:
- Bring back the Fargate option (using the default cluster)