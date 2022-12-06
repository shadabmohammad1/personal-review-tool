#!/usr/bin/env python
import argparse
import datetime
import getpass
import subprocess  # nosec
import sys

import boto3
import git

# Jumpoint account id (where docker repo exists)
account_id = "432932430231"

# TODO: from .utils import output, execute


def output(message):
    print("")
    print("=========================================================")
    print(message)
    print("=========================================================")
    print("")


def execute(command):
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)  # nosec
    for line in iter(process.stdout.readline, b""):
        line = line.decode("utf-8")
        line = "[{}] {}".format(datetime.datetime.now(), line) if line.startswith("Step") else line
        sys.stdout.write(line)
    process.wait()
    if process.returncode:
        exit(process.returncode)


parser = argparse.ArgumentParser(
    description="Builds docker containers, tags them, and pushes to ECR"
)
parser.add_argument(
    "image_name", type=str, help="The name of the image to build",
)

parser.add_argument(
    "--dockerfile", dest="dockerfile", type=str, help="Docker target for multi-stage builds",
)
args = parser.parse_args()

repo = git.Repo(search_parent_directories=True)
git_hash = repo.head.object.hexsha
branch = repo.active_branch.name.replace("/", "_")
username = getpass.getuser()

# Configuring local docker to push to AWS ECR
# docker_login = subprocess.check_output(  # nosec
#     "aws ecr get-login-password --no-include-email --region us-west-2 --registry-ids {}".format(
#         account_id
#     ).split()
# ).decode("utf-8")

docker_login = subprocess.Popen(  # nosec
    "aws ecr get-login-password --region us-west-2".split()
)
docker_login_2 = subprocess.check_output(
    "docker login --username AWS --password-stdin {}.dkr.ecr.region.amazonaws.com".format(
        account_id
    ).split().decode("utf-8"),
    stdin=docker_login.stdout
).decode("utf-8")

output(docker_login_2.stdout)

output("Building image")
execute(
    "docker build -t {} -f {} --build-arg {}={} .".format(
        args.image_name, args.dockerfile, "BUILD_GIT_HASH", git_hash,
    )
)

execute(
    "docker tag {0}:latest {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:latest".format(
        args.image_name, account_id
    )
)
execute(
    "docker tag {0}:latest {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_latest".format(
        args.image_name, account_id, branch
    )
)
execute(
    "docker tag {0}:latest {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_latest".format(
        args.image_name, account_id, username
    )
)
execute(
    "docker tag {0}:latest {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_{3}".format(
        args.image_name, account_id, branch, git_hash
    )
)

execute(docker_login)

output("Pushing image to ECR")
execute(
    "docker push {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_latest".format(
        args.image_name, account_id, branch
    )
)
execute(
    "docker push {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_latest".format(
        args.image_name, account_id, username
    )
)
execute(
    "docker push {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:{2}_{3}".format(
        args.image_name, account_id, branch, git_hash
    )
)
execute(
    "docker push {1}.dkr.ecr.us-west-2.amazonaws.com/{0}:latest".format(args.image_name, account_id)
)

output(
    """Image uploaded successfully with the following tags:
- {0}:latest
- {0}:{1}_latest
- {0}:{3}_latest
- {0}:{1}_{2}""".format(
        args.image_name, branch, git_hash, username
    )
)
