---
image: /img/blog/bruce-warrington-eMqG0_PpoGg-unsplash.jpg
title: Using GitLab Pages to Host a Helm Registry
credits: Photo by [Bruce Warrington](https://unsplash.com/@brucebmax?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
excerpt: Hosting your own Helm Registry is helpful for making Kubernetes deployments reusable. GitLab Pages is a great way of hosting your own Helm Registry without any hosting charges and by setting up a few triggers, is easy to incorporate it into your automated workflow.
tags: helm, kubernetes, gitlab, devops
---

> To see this in action, check out
> [gitlab.com/MrSimonEmms/helm-repo](https://gitlab.com/MrSimonEmms/helm-repo)

Helm is a great way of sharing Kubernetes resources and making them reusable. The
[documentation](https://helm.sh/docs/topics/registries) provides a way of creating
a registry using a Docker image that you can host yourself. This provides lots of
functionality, such as authentication and commands to interact with it. If you have
your own infrastructure and need authentication, this is a great way to start. However,
if you're publishing an open-source project, or you don't need authentication then
managing infrastructure is an expense and overhead you don't need.

Enter [GitLab Pages](https://docs.gitlab.com/ee/user/project/pages/).

## What is GitLab Pages

GitLab Pages is a way of publishing static files to the internet. It also allows
you to use any URL you want and can be configured to use Let's Encrypt TLS certificates.

As a Helm Registry is simply an `index.yaml` file and a collection of `.tar.gz`
files, this makes GitLab Pages a great option for hosting your registry.

## Setting Up Your Repo

To set the repository up, you actually only need three files configured.

> The `packages` directory is used in case you want to set up a website to read
> the `index.yaml`. This is outside the scope of this post, but can be copied
> from my [Helm Registry source code](https://gitlab.com/MrSimonEmms/helm-repo/-/merge_requests/1)

### /packages/index.html

This file is required for GitLab Pages to trigger building of the website. Even
though it's not required for the Helm Registry, without it, this won't be
published as a website.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Helm Registry</title>
</head>
<body>
  My Helm Registry
</body>
</html>
```

---

### /packages/index.yaml

This is the contents of the Helm Registry. Eventually, this will contain a list
of all the packages published to your registry.

```yaml
apiVersion: v1
entries: {}
```

---

### /.gitlab-ci.yml

This file controls how the GitLab CI/CD builds the package. There are two tasks
here:
 - the `add_helm_chart` task is run when a trigger is received. It downloads the
  Helm chart, adds
it to the `index.yaml` file and commits it to the repository
 - the `pages` task is run when a commit is pushed to the `master` branch. It
publishes the
`packages` directory as your website.

```yaml
stages:
  - init
  - publish

image: node

variables:
  GIT_REPO_DIR: ./git-repo
  HELM_REPO_DIR: ./packages

add_helm_chart:
  rules:
    - if: '$CI_PIPELINE_TRIGGERED == "true" && $PROJECT_CHART_REPO != null && $PROJECT_OWNER != null && $TAG_NAME != null && $CHART_DIR != null && $CHART_NAME != null'
  image: registry.gitlab.com/mrsimonemms/gitlab-ci-tasks/kubectl-helm
  stage: init
  before_script:
    - git remote set-url origin https://${GITLAB_USER_LOGIN}:${GITLAB_TOKEN}@gitlab.com/${CI_PROJECT_PATH}.git
    - git config --global user.email "${GITLAB_USER_EMAIL}"
    - git config --global user.name "${GITLAB_USER_NAME}"
    - git checkout -B ${CI_COMMIT_REF_NAME}
    - git pull origin ${CI_COMMIT_REF_NAME}
    - cd ${HELM_REPO_DIR}
  script:
    - git clone https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/${PROJECT_OWNER}/${PROJECT_CHART_REPO}.git ${GIT_REPO_DIR}
    - cd ${GIT_REPO_DIR}
    - git checkout ${TAG_NAME}
    - cd -
    - helm package ${GIT_REPO_DIR}/${CHART_DIR}/${CHART_NAME} -d .
    - helm repo index --url ${HELM_REPO_URL} --merge index.yaml .
    - rm -Rf ${GIT_REPO_DIR}
    - git status
    - git add .
    - "git commit -m \"chore: add ${PROJECT_OWNER}/${PROJECT_CHART_REPO} ${TAG_NAME} to Helm repo\""
    - git status
    - git push origin ${CI_COMMIT_REF_NAME}

pages:
  stage: publish
  script: mv ${HELM_REPO_DIR} public
  artifacts:
    paths:
      - public
  only:
    - master
  except:
    - triggers
```

---

## Configuration

For this to work, various bits of configuration must be done:

### Configure Custom URL (optional)

If you want to host this on a custom URL, you can add this in the Settings ->
Pages section. Follow the instructions on screen to add the DNS records.

If you don't do this, you can use the default [gitlab.io](https://gitlab.io) URL.

### Create a Personal Access Token

Create a [Personal Access Token](https://gitlab.com/-/profile/personal_access_tokens)
with the `api` scope selected (from the documentation, you should also be able
to use the `write_repository` scope although I've not tested it with that).

### Add CI/CD Variables

In the Settings -> CI/CD section for your repository, create some variables:
 - `GITLAB_TOKEN` - this is the value of the Personal Access Token above. This
value should be both `protected` and `masked`
 - `HELM_REPO_URL` - this is the URL to host the repository on. This must be the
fully qualified domain, including `https://` at the start. As an example, my
value is `https://helm.simonemms.com`. This doesn't need to be `protected` or
`masked` but won't hurt if they are.

### Create a Pipeline Trigger

In the Settings -> CI/CD section for your repository, create a Pipeline Trigger.
A good description would be "Add Helm chart to registry", although the exact
working is up to you.

Keep a note of both the project ID in the example (in the format
`https://gitlab.com/api/v4/projects/xxxx/trigger/pipeline`) and the token.

---

## Adding a Chart to your Registry

> As this uses `git clone` to get the project, this can get any public repository
> or any private repo that's owned by the same user/group as the Helm Registry.

Now you've set the Helm Registry repository up, you can begin to integrate this
with other repositories that contain the Helm charts you wish to publish. Ultimately,
this is a simple cURL call.

This worked example will use values from
[gitlab.com/MrSimonEmms/openfaas-amqp1.0-connector](https://gitlab.com/MrSimonEmms/openfaas-amqp1.0-connector).
You will need to replace these with your own values.

```bash
export CHART_DIR=chart # Location of the Helm chart directory in the repository
export CHART_NAME=openfaas-amqp1.0-connector # Location of the chart with the Helm chart directory
export CI_PROJECT_NAMESPACE=MrSimonEmms # In GitLab CI/CD, this is pre-filled
export CI_PROJECT_NAME=openfaas-amqp1.0-connector # In GitLab CI/CD, this is pre-filled
export HELM_REPO_TRIGGER_TOKEN=xxxxxxxx # The trigger token for the Helm Registry project (generated above)
export HELM_REPO_PROJECT_ID=123456 # The project ID of the Helm Registry project (see the trigger configuration above)
export VERSION=v1.0.0 # The branch or tag to publish

curl -f -X POST \
  -F token=${HELM_REPO_TRIGGER_TOKEN} \
  -F ref=master \
  -F variables[PROJECT_OWNER]=${CI_PROJECT_NAMESPACE} \
  -F variables[PROJECT_CHART_REPO]=${CI_PROJECT_NAME} \
  -F variables[TAG_NAME]=${VERSION} \
  -F variables[CHART_DIR]=${CHART_DIR} \
  -F variables[CHART_NAME]=${CHART_NAME} \
  https://gitlab.com/api/v4/projects/${HELM_REPO_PROJECT_ID}/trigger/pipeline
```

This will trigger the `add_helm_chart` job inside the GitLab CI/CD config.
After a few minutes, you will see a new commit to the `master` branch and
then you will find the chart added to the `index.yaml` file.

That's pretty much all there is to hosting your own Helm Registry in GitLab
Pages. Also, this doesn't matter if a specific version is added via the trigger
multiple times - Helm will manage that for you.
