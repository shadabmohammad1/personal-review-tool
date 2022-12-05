#!/usr/bin/env python3
import argparse
import json
import os

import boto3
import git
import jinja2

# Jumpoint account id (where docker repo exists)
account_id = "432932430231"
region = os.environ["AWS_DEFAULT_REGION"]
app_name = "review-tool"
app_container_name = "api"


def output(message):
    print("")
    print("=========================================================")
    print(message)
    print("=========================================================")
    print("")


def get_secrets(prefix):
    secretsmanager = boto3.client("secretsmanager")
    response = secretsmanager.list_secrets(Filters=[{"Key": "name", "Values": [prefix]}])
    secrets = []
    for secret in response["SecretList"]:
        secrets.append({"name": secret["Name"].replace(prefix, ""), "valueFrom": secret["ARN"]})
    return json.dumps(secrets)


def create_task_definition(environment, service, mode, cpu, memory):
    ecs = boto3.client("ecs")
    sts = boto3.client("sts")
    repo = git.Repo(search_parent_directories=True)
    git_hash = repo.head.object.hexsha
    branch = repo.active_branch.name.replace("/", "_")

    templateLoader = jinja2.FileSystemLoader(searchpath=os.path.dirname(__file__))
    templateEnv = jinja2.Environment(loader=templateLoader)
    template = "fargate_task_definition.jinja" if mode == "FARGATE" else "ec2_task_definition.jinja"

    task_definition = templateEnv.get_template(template).render(
        api_image="{}.dkr.ecr.{}.amazonaws.com/{}:{}_{}".format(
            account_id, "us-west-2", app_name, branch, git_hash
        ),
        environment=environment,
        service=service,
        account_id=sts.get_caller_identity()["Account"],
        secrets=get_secrets("{}/{}-app/".format(environment, app_name)),
        dev_managed_env_vars="{}-env-vars-dev-managed.env".format(app_name),
        terraform_managed_env_vars="{}-env-vars-terraform-managed.env".format(app_name),
        cpu=cpu,
        memory=memory,
        region=region,
    )
    task_definition = json.loads(task_definition)
    return ecs.register_task_definition(**task_definition)


class RunTaskException(Exception):
    """Exception specific to run task command."""


# This enables envoking commands directly on the ECS CLUSTER
# Very useful to be able to modify the command and run this directly
# from my local machine in order to test various things
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run task on ECS")

    parser.add_argument(
        "environment",
        type=str,
        help="The environment to run the task on (i.e. 'staging' or 'production')",
    )
    parser.add_argument(
        "service", type=str, help="The service to deploy (i.e. 'onboarding')",
    )
    parser.add_argument(
        "mode", type=str, help="'EC2' or 'FARGATE'",
    )
    parser.add_argument(
        "cpu", type=str, help="i.e. 1024",
    )
    parser.add_argument(
        "memory", type=str, help="i.e. 2048",
    )

    args = parser.parse_args()

    output("Creating Task Definition: {}".format(args.service))
    task_def = create_task_definition(
        args.environment, args.service, args.mode, args.cpu, args.memory
    )

    directory = os.path.dirname(os.path.realpath(__file__))
    try:
        os.mkdir("{}/task-def-arns/{}".format(directory, args.environment))
    except FileExistsError:
        pass
    arn_file = "{}/task-def-arns/{}/{}-{}.txt".format(
        directory, args.environment, region, args.service
    )

    output("Writing Task Definition ARN to {}".format(arn_file))
    f = open(arn_file, "w")
    f.write(task_def.get("taskDefinition").get("taskDefinitionArn"))
    f.close()
