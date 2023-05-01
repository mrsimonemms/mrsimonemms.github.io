---
image: /img/blog/the-beatboy--lYi5Qg0xP0-unsplash.jpg
title: Multi-Arch Docker Containers
credits: Photo by [the beatboy](https://unsplash.com/@the_beatboy?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: Creating containers for different architectures isn't as hard as you think by following these simple steps
tags: kubernetes, docker, devops, containers
---
Containers have revolutionised computing since they were first popularised by
[Docker](https://docker.io) in the first half of the 2010s. Containers have made
developing software and deploying it far simpler than it has ever been by creating an
artifact that can work across different systems. By maintaining it's own dependencies
independent of the host machine, we no longer have to ensure that all developers and
deployment environments are using _version x.y.z_ of a language and the correct versions
of all our databases.

With the exception of multi-architectural deployments that is.

## What is multi-arch?

I am currently writing this post on my laptop - it's a 64 bit machine running Ubuntu 19.10.
If I run `uname -p`, it proves that it's a 64 bit machine by printing `x86_64`. When I come
to deploy it to my Raspberry Pi cluster (yes, I'm that cool kids), that'll be on a 32 bit
processor - `uname -p` now gives me `armv7l`.

This is the description of the processor on the computer itself and it's architecture. When
you're running your containers, you get used to largely being able to ignore the host machine
and it's capabilities entirely - you might be running Windows or OSX, but if your container
is an Ubuntu or Alpine-based image, you'll be doing everything in Linux.

The processor is one of the few things that the container does not virtualise. If you
have a 64 bit host machine, your container **MUST** be compatible with a 64 bit processor.
For the most part, this causes us few problems - we all tend to develop on 64 bit machines
and deploy to cloud provider of choice who provides us with a fleet of 64 bit machines.
This only becomes a problem if we need to support multiple architectures at any stage
the of the software development lifecycle.

## Why are multi-arch containers a good idea?

Until fairly recently, if you wanted to deploy your containerised application, you were
pretty-much limited to doing so to 64 bit machines. It was possible to get [Docker
Swarm](https://blog.hypriot.com/post/how-to-setup-rpi-docker-swarm/) onto a Raspberry Pi
and Kubernetes was (officially) off limits.

Then along came [Scaleway](https://www.scaleway.com/en/virtual-instances/arm-instances)
with their very cheap ARM clouds and [K3S](https://k3s.io) with a lightweight Kubernetes
that was perfect for Raspberry Pis. Now you can have very cost-effective and
(with enough nodes) high-performing clusters running on machines lying around your office.
These are perfect for development and staging clusters to test out your applications.

In recent years to, the rise of the Internet of Things (IoT) has largely been made
possible by lightweight processors. I've worked with many IoT companies over the years
and it's always useful to be able to have a virtual device with which to interact in
development and testing - this process is simplified greatly if you have that software
in a container.

If none of these reasons convince you based on your requirements today, think about
what the future might bring. There have been [persistent rumours that Apple will switch
to ARM processors](https://www.macrumors.com/guide/arm-macs) in the future (which may
or may not require multi-archness). You also rarely know exactly where your application
will be heading in 3+ years time - I've lost count of the number of times I've been
told by architects and products owners "no Simon, we definitely will never do _x_
feature" only to find I'm building that exact feature 6 months later.

Finally, it's a very simple change that add almost no time or effort to the build
pipeline - for the effort involved, is it not worth just having it there in the background?

## Docker Setup

> Even those the experimental version of Docker is not recommended for production
> use, it is fine for building the containers. You do **NOT** need to enable experimental
> mode on your deployment machine. As further evidence for it's use, this is how
> Docker provides multi-arch support for all officially supported containers.

In order to make truly multi-arch containers, we need to use the experimental version
of Docker. To do that, go to your command line and edit the file `~/.docker/config.json`.
This is a JSON file, and you need to ensure that `experimental` is set to `enabled`.

```json
{
  "experimental": "enabled"
}
```

It's likely you'll have additional settings in there - leave those as they are. To
prove you have enabled experimental mode, type `docker manifest --help` and you should
see the help page.

Next, you need to [enable](https://hub.docker.com/r/multiarch/qemu-user-static)
[Qemu](https://www.qemu.org/) support for your Docker host instance. Qemu is a generic
machine emulator and virtualiser. In simple terms, it allows your machine with one type
of processor to emulate other types of processor, allowing your machine to execute
scripts on different processor architectures.

> This updates the Docker machine instance. It will only need to be done once for
> your Docker instance. If you restart your machine or the Docker instance, you will
> need to run it again.

```shell script
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

Now you have your Docker instance set up. It's time to consider the Dockerfile. Under
normal circumstances, your Dockerfile would start off with using the `FROM` command
to pull in an image, perhaps `FROM node:12-alpine`. Now you're in the multi-arch world,
you cannot simply do that. Since [2017](https://www.docker.com/blog/docker-official-images-now-multi-platform/)
all Docker images are multi-arch - if you just use the image name, eg `node`, it queries
the manifest against your host machine's processor and pulls that down. On a 64 bit
machine, it actually pulls down `amd64/node`.

To get around that, we need to specify the architecture. Since Docker v17, we can add
build arguments before the `FROM` tag. So you will need to change your Dockerfile like
so:

```Dockerfile
ARG ARCH="amd64"
FROM ${ARCH}/node:12-alpine
CMD [ "uname", "-a" ]
```

We're defaulting the `ARCH` argument to `amd64` and then telling Docker to pull down
that exact image. If we now build two different images, one for amd64 and one for a
Raspberry Pi 3B, we should see differences.

```shell script
docker build -t riggerthegeek/multiarch-test:amd64 .
docker build --build-arg=ARCH=arm32v7 -t riggerthegeek/multiarch-test:arm32v7 .
docker run -it --rm riggerthegeek/multiarch-test:amd64 # String includes x86_64
docker run -it --rm riggerthegeek/multiarch-test:arm32v7 # String include armv7l
```

Now we have all the images built, we need to combine them into a manifest. As touched
on above, a manifest is a way of combining multiple images into a single image, allowing
the machine that's pulling the image to decide which one it wants to actually use. There
are many use-cases for this, such as whether the host's operating systems is Windows. In
our case, we only want to differentiate by the processor.

> You will need to push the above images before running this command

```shell script
docker manifest create riggerthegeek/multiarch-test \
    riggerthegeek/multiarch-test:amd64 \
    riggerthegeek/multiarch-test:arm32v7
docker manifest push riggerthegeek/multiarch-test
```

If you run `docker manifest inspect riggerthegeek/multiarch-test` now, you will see
how the host Docker engine will decide which image to use.

Finally, test your container on an AMD64 machine and on a Raspberry Pi. You should see
different results, but notice how you're only specifying the image name, not the tag.

```shell script
docker run -it --rm riggerthegeek/multiarch-test # x86_64 on AMD64, armv7l on Raspberry Pi
```

You have now built a multi-arch Docker image, deployable to both 64 bit machines and
Raspberry Pi 3B/3B++.

## Building with GitLab

I use GitLab for my CI. Enabling multi-arch builds in GitLab is really simple - it's
one environment variable and then the same commands as above. This is my usual setup
in my `.gitlab-ci.yml` - I've removed all branching guards and strategies for brevity.

```yaml
variables:
  DOCKER_CLI_EXPERIMENTAL: enabled # Required for docker manifests - the only change required
  DOCKER_DRIVER: overlay2
  DOCKER_HOST: tcp://docker:2375

stages:
  - build
  - publish

# Extensible commands
.docker_base:
  image: docker:stable
  services:
    - docker:dind
  tags:
    - docker
  before_script:
    - docker login -u ${CI_REGISTRY_USER} -p ${CI_REGISTRY_PASSWORD} ${CI_REGISTRY}
    - docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

.docker_build:
  extends: .docker_base
  stage: build
  script:
    - docker build --build-arg=ARCH=${ARCH} -t ${CI_REGISTRY_IMAGE}/${ARCH}:${CI_COMMIT_SHA} .
    - docker push ${CI_REGISTRY_IMAGE}/${ARCH}:${CI_COMMIT_SHA}

# Build amd64 image
docker_build_amd64:
  extends: .docker_build
  variables:
    ARCH: amd64

# Build arm32v7 image
docker_build_arm32v7:
  extends: .docker_build
  variables:
    ARCH: arm32v7

# Combine both images in a manifest and publish
docker_publish:
   extends: .docker_base
   stage: publish
   script:
     - |
         docker manifest create ${CI_REGISTRY_IMAGE}
           ${CI_REGISTRY_IMAGE}/amd64:${CI_COMMIT_SHA}
           ${CI_REGISTRY_IMAGE}/arm32v7:${CI_COMMIT_SHA}
     - docker manifest push ${CI_REGISTRY_IMAGE}
```

## Warnings

Building through the emulator is slower. Unless you absolutely have to, I would recommend
only building the full manifest on `master` and `develop` branches.
