---
image: /img/blog/brett-jordan-DDupbpu4MS4-unsplash.jpg
title: Using a non-Ubuntu base image in Gitpod
credits: Photo by [Brett Jordan](https://unsplash.com/@brett_jordan)
excerpt: The Gitpod-built images are all derived from Ubuntu. But that doesn't meant that's all you can use.
tags: development, cloud native, gitpod, kubernetes, containers, workspaces
---

About 3 weeks ago, the technical lead of one of Gitpod's self-hosted customers
messaged me saying:

> Hey Simon. I know we have to use Ubuntu for our images, but one of our teams
> uses a testing framework that only runs on CentOS.
>
> Please help.

What had happened was they had conflated two facts about Gitpod:

1. when running a Gitpod installation, you must [run Ubuntu on your Kubernetes nodes](https://www.gitpod.io/docs/self-hosted/latest/cluster-set-up#node-and-container-requirements)
1. the [Gitpod workspace images](https://github.com/gitpod-io/workspace-images)
use an Ubuntu image (currently `buildpack-deps:focal`) as the base

<br />

However, this doesn't mean that you **MUST** use Ubuntu. In fact, you can theoretically
use any Linux distribution as your base image (except Alpine - see
[#3356](https://github.com/gitpod-io/gitpod/issues/3356)).

## Building a CentOS base image

In principal, this is just a question of copying the Ubuntu image and changing all
the `apt-get install` commands for `yum install` and changing the package names
where relevant.

Take a look at the [Dockerfile](https://github.com/MrSimonEmms/gitpod-centos-base-image/blob/main/Dockerfile)
to see how you could achieve this. There are quite a few packages in here which
make it all work:

- bash-completion
- other Unix shells, such as Fish and ZSH
- development tools
- Git and Git LFS
- Docker and Docker Compose

<br />

It also creates a `gitpod` user with the user ID `33333` and grants it anonymous
`sudo` access.

## Using this in your project

Now we have a base image, we can use this in our project. This is as simple as
defining a [custom Docker image](https://www.gitpod.io/docs/config-docker) in
your `.gitpod.yml`. Then you can create a `.gitpod.Dockerfile` like this:

```Dockerfile
FROM ghcr.io/mrsimonemms/gitpod-centos-base-image:latest

### Node.js ###
LABEL dazzle/layer=lang-node
LABEL dazzle/test=tests/lang-node.yaml
USER gitpod
ENV NODE_VERSION=16.13.0
ENV TRIGGER_REBUILD=1
RUN curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | PROFILE=/dev/null bash \
  && bash -c ". .nvm/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && npm install -g typescript yarn node-gyp" \
  && echo ". ~/.nvm/nvm-lazy.sh"  >> /home/gitpod/.bashrc.d/50-node
# above, we are adding the lazy nvm init to .bashrc, because one is executed on interactive shells, the other for non-interactive shells (e.g. plugin-host)
COPY --chown=gitpod:gitpod nvm-lazy.sh /home/gitpod/.nvm/nvm-lazy.sh
ENV PATH=$PATH:/home/gitpod/.nvm/versions/node/v${NODE_VERSION}/bin

USER gitpod
```

You will need to copy [nvm-lazy.sh](https://github.com/gitpod-io/workspace-images/blob/main/chunks/lang-node/nvm-lazy.sh)
into your project. You could also use a cURL command to download it from GitHub,
but I couldn't be bothered for a simple app.

Once you've done that, your workspace is ready for development in Gitpod

## Further work

If you're having to use this for multiple projects, you will most probably want
to create either a [workspace-full](https://hub.docker.com/r/gitpod/workspace-full)
equivalent (or whatever languages you want to support). Creating a standalone image
and publishing it to your own Docker registry isn't covered here, but isn't any
more difficult than creating a Docker image.

## Resources

- [CentOS Base Image](https://github.com/MrSimonEmms/gitpod-centos-base-image):
a Gitpod CentOS base image you can use yourselves
- [CentOS Node Example](https://github.com/MrSimonEmms/gitpod-centos-node-example):
an example GitHub repository with a Node application
