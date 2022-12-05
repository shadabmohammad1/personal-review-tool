#!/usr/bin/env python3
# @author gposton@absoluteintegrityllc.com

# This script deploys code to ECS using 1 of 2 strategies.
# 1) Code Deploy
# 2) Updating ECS Service directly

# It requires 3 arguments:
# - The name of the app in CodeDeploy (--application)
# - The name of the image to deploy (--image)
# - The deploy strategy (--use-codedeploy OR --use-service)

# Note that there is a hard-coded root_account_id in this file that will need to be set.
# This is used for accessing ECR docker repos.
# Note that the URLs are hard-coded to us-west-2.  These will need to be updated if you are
# not using us-west-2.

import argparse
import hashlib
import json
import os
import re
import subprocess  # nosec
import sys
import time

import boto3
import git
import jinja2

root_account_id = "432932430231"
app_name = "review-tool"
region = "us-west-2"


repo = git.Repo(search_parent_directories=True)
git_hash = repo.head.object.hexsha
branch = repo.active_branch.name.replace("/", "_")

parser = argparse.ArgumentParser(description="Deploy container to ECS")
parser.add_argument(
    "environment",
    type=str,
    help="The environment to deploy [image] to (i.e. 'staging' or 'production')",
)
parser.add_argument(
    "service", type=str, help="The service to deploy (i.e. 'onboarding')",
)
parser.add_argument(
    "cpu", type=str, help="The CPU alotment for the service.",
)
parser.add_argument(
    "memory", type=str, help="The memory alotment for the service.",
)
# parser.add_argument("application", type=str, help="The application to deploy [image] to")
parser.add_argument("--no-input", help="Skip verification during deploy", action="store_true")
args = parser.parse_args()

ecs = boto3.client("ecs")
events = boto3.client("events")
s3 = boto3.client("s3")
code_deploy = boto3.client("codedeploy")
sts = boto3.client("sts")


def output(message):
    print("")
    print("=========================================================")
    print(message)
    print("=========================================================")
    print("")


def execute(command):
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)  # nosec
    output = []
    for line in iter(process.stdout.readline, b""):
        sys.stdout.write(line)
        output.append(line)


def get_deploy_result(deployment_id):
    code_deploy = boto3.client("codedeploy")
    deploy = code_deploy.get_deployment(deploymentId=deployment_id)
    deploy_status = deploy.get("deploymentInfo").get("status")
    output("Waiting for deploy {} to complete: {}".format(deployment_id, deploy_status))
    while deploy_status == "InProgress" or deploy_status == "Created":
        time.sleep(60)
        deploy = code_deploy.get_deployment(deploymentId=deployment_id)
        deploy_status = deploy.get("deploymentInfo").get("status")
        output("Waiting for deploy to complete: {}".format(deploy_status))
    return deploy_status


def get_secrets(prefix):
    secretsmanager = boto3.client("secretsmanager")
    response = secretsmanager.list_secrets(Filters=[{"Key": "name", "Values": [prefix]}])
    secrets = []
    while True:
        for secret in response["SecretList"]:
            secrets.append({"name": secret["Name"].replace(prefix, ""), "valueFrom": secret["ARN"]})
        if "NextToken" in response:
            response = secretsmanager.list_secrets(
                Filters=[{"Key": "name", "Values": [prefix]}], NextToken=response.get("NextToken")
            )
        else:
            break
    return json.dumps(secrets)


def _get_task_def_arn(environment, region, task_name):
    ci_dir = os.path.dirname(__file__)
    filename = "{}/task-def-arns/{}/{}-{}.txt".format(ci_dir, environment, region, task_name)
    task_def_arn = open(filename, "r").readline()
    return task_def_arn


def _get_task_def_arns(environment):
    regions = ["us-west-2", "ap-south-1"]
    tasks = [
        "review-tool-run-fargate-task-small",
        "review-tool-run-ec2-task-small",
        "review-tool-run-ec2-task-large",
    ]

    task_def_arns = {}
    for region in regions:
        task_def_arns[region] = {}
        for task in tasks:
            task_def_arns[region][task] = _get_task_def_arn(environment, region, task)

    return task_def_arns


def create_task_definition(environment, service):
    ecs = boto3.client("ecs")
    sts = boto3.client("sts")
    repo = git.Repo(search_parent_directories=True)
    git_hash = repo.head.object.hexsha
    branch = repo.active_branch.name.replace("/", "_")

    ci_dir = os.path.dirname(__file__)
    templateLoader = jinja2.FileSystemLoader(searchpath=ci_dir)
    templateEnv = jinja2.Environment(loader=templateLoader)

    task_definition = templateEnv.get_template("web_task_definition.jinja").render(
        api_image="{}.dkr.ecr.{}.amazonaws.com/{}:{}_{}".format(
            root_account_id, region, "review-tool-backend", branch, git_hash
        ),
        nginx_image="{}.dkr.ecr.{}.amazonaws.com/{}:{}_{}".format(
            root_account_id, region, "review-tool-frontend", branch, git_hash
        ),
        environment=environment,
        service=service,
        account_id=sts.get_caller_identity()["Account"],
        secrets=get_secrets("{}/{}-app/".format(environment, app_name)),
        dev_managed_env_vars="{}-env-vars-dev-managed.env".format(app_name),
        terraform_managed_env_vars="{}-env-vars-terraform-managed.env".format(app_name),
        cpu=args.cpu,
        memory=args.memory,
        # These txt files are written by the 'create_task_def.py' script
        review_tool_run_fargate_task_small_arn=_get_task_def_arn(
            environment, "us-west-2", "review-tool-run-fargate-task-small"
        ),
        review_tool_run_ec2_task_small_arn=_get_task_def_arn(
            environment, "us-west-2", "review-tool-run-ec2-task-small"
        ),
        review_tool_run_ec2_task_large_arn=_get_task_def_arn(
            environment, "us-west-2", "review-tool-run-ec2-task-large"
        ),
        task_def_arns=json.dumps(_get_task_def_arns(environment))
        .replace('"', '\\"')
        .replace("\n", "\\n"),
        region=region,
    )
    task_definition = dict(json.loads(task_definition))
    return ecs.register_task_definition(**task_definition)


# Verify of deploy
if not args.no_input:
    output("Deploying {} to {}.".format(image, app_name))
    verification = str(input("Type 'yes' to continue (anything else will abort): "))  # nosec
    if verification != "yes":
        exit(0)

# Create a new task definition using the previous revision as a template
output("Uploading new task defintion revision")
task_definition = create_task_definition(args.environment, args.service)

# Create a appspec file using the template uploaded to s3 by terraform
appspec = json.loads(
    s3.get_object(
        Bucket="review-tool-code-deploy-source-bucket-{}".format(args.environment),
        Key="{}-web/appspec.json".format(app_name),
    )
    .get("Body")
    .read()
    .decode("utf-8")
)
appspec["Resources"][0]["TargetService"]["Properties"]["TaskDefinition"] = task_definition.get(
    "taskDefinition"
).get("taskDefinitionArn")

# Kick off deploy
output("Kicking off code deploy")
appspec_string = json.dumps(appspec)
revision = {
    "revisionType": "AppSpecContent",
    "appSpecContent": {
        "content": appspec_string,
        "sha256": hashlib.sha256(appspec_string.encode("utf-8")).hexdigest(),
    },
}
deploy_result = "Failed"
try:
    deployment_name = "{}-web".format(app_name)
    deploy = code_deploy.create_deployment(
        applicationName=deployment_name, deploymentGroupName=deployment_name, revision=revision,
    )
    deploymentID = deploy.get("deploymentId")
    deploy_result = get_deploy_result(deploymentID)
except Exception as e:
    if "DeploymentLimitExceeded" in str(e):
        match = re.match(r".*'(d-.*)'.*", str(e))
        try:
            deployment_id = match.group(1)
        except Exception:
            raise
        get_deploy_result(deployment_id)
        time.sleep(60)
        deploy = code_deploy.create_deployment(
            applicationName=app_name, deploymentGroupName=app_name, revision=revision,
        )
        deploymentID = deploy.get("deploymentId")
        deploy_result = get_deploy_result(deploymentID)
    else:
        raise e

base_url = "https://{}.console.aws.amazon.com/codesuite/codedeploy/deployments/".format(region)
output(
    """New Task Definition Arn:
{}

Link to deploy:
{}{}?region={}""".format(
        task_definition.get("taskDefinition").get("taskDefinitionArn"),
        base_url,
        deploy.get("deploymentId"),
        region,
    )
)
if deploy_result == "Failed":
    exit(1)
