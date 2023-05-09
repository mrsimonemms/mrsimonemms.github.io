---
image: /img/blog/braden-collum-9HI8UJMSdZA-unsplash.jpg
title: Live Reload for OpenFaas
credits: Photo by [Braden Collum](https://unsplash.com/@bradencollum?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: OpenFaas is a great tool and a great way of getting started with serverless functions. But it can be tricky for team development
tags: kubernetes, docker, devops, containers, openfaas, serverless, functions
---

> 2020-08-15: Added GoLang example

---

> This article assumes a degree of familiarity with OpenFaaS. I won't be covering
> how to get started in it or the key concepts in any detail. If you want to
> get started with it, please see their [excellent documentation](https://docs.openfaas.com/).

I am a big fan of "serverless" functions. They help your application scale to a
theoretically unlimited capacity. They are so useful that there is a whole
myriad of implementations - AWS, Azure and GCP all have their own native versions,
you can use the Serverless framework and then there's the like of KNative. And
these are just the ones I can remember off the top of my head.

One of my favourite versions is [OpenFaaS](https://openfaas.com) by the very
excellent [Alex Ellis](https://www.alexellis.io/). This has the advantage of
being open source, a vibrant community and really easy to get started. It's also
cloud native, so you're not tied into a particular cloud provider (yes, I'm
looking at you AWS/Azure/GCP) - if it runs in Kubernetes, it'll run in OpenFaaS.

One of my biggest gripes with OpenFaaS is that it can be painful developing
new functions. It's fine if you want to stick it in the public Docker Registry
and/or you don't mind waiting for a minute or two each time you change your
code. I regularly work for companies that don't want their proprietary code
being published on the internet for anyone to use.

Also, I'm impatient and hate compile time.

[![Compiling](https://imgs.xkcd.com/comics/compiling.png "Compiling")](https://xkcd.com/303/)

The official workflow is:

```bash
faas-cli build # Build the image
faas-cli push # Push to Docker Hub
faas-cli deploy # Deploy to your cluster
```

Each of these steps could well take in excess of 30 seconds. Painful when
you're hacking away.

## Docker Compose To The Rescue

> There is an accompanying Git repo with this. Please check that out to see the
> source code - [gitlab.com/MrSimonEmms/openfaas-docker-compose](https://gitlab.com/MrSimonEmms/openfaas-docker-compose)

Docker Compose is perhaps a little unfashionable with Kubernetes-enabled teams,
but it serves a great place for efficient local development.

__IMPORTANT__: this development workflow exists outside OpenFaaS. It uses the
template that you will use when it moves to production, but when developing
your function you won't have access to things like the async workflow. However,
as you would be focusing on getting your function working rather than accessing
it, that's usually an easy concession to make.

## The Process Explained

> If you are using the Classic Watchdog, there is nothing to do here and your
> function will automatically reflect any changes each time you invoke the function.
> This is because the Classic Watchdog runs the whole command each time the function
> is invoked.

The OF Watchdog is the modern and (in my opinion) the better watchdog. The function
runs as a single HTTP endpoint on all methods. It's better because it allows improved
error handling. However, because it's an application inside the function, we need
to change how that application works - basically, you need to put a file watcher
in that restarts the application each time you make a change to the code.

The important one here is the `fprocess` environment variable. This is the command
that run the application. For example, in the `node12` template the `fprocess`
envvar is `node index.js`.

We also need to set the `volumes` and set the `user` to `root`. The reason we have
to set the `user` to `root` is to be able to install any global dependencies to
the container at runtime. Even though this is an anti-pattern in a production container,
I would argue that this is ok in a dev-only container to avoid having to maintain
duplicate Dockerfiles.

## Secrets

OpenFaaS supports [secrets](https://docs.openfaas.com/reference/secrets/) by
putting the file in `/var/openfaas/secrets`. Docker Compose stores secrets in
`/run/secrets` so you will need to do some form of either/or load, appropriate
to the language. I suggest putting the OpenFaaS version as the default to
reduce load in the production environment.

**IMPORTANT:** You should never store sensitive data in a repo.

## Getting Started

Let's start by creating a `Makefile` in the root of your project. The purpose of
this is to be able to easily install all the templates found in the `functions.yml`
file. Strictly speaking, this is optional, but it makes life a lot easier.

```Makefile
FUNC_FILE ?= './functions.yml'

templates:
  which faas-cli || (echo "Please install 'faas-cli' package" && exit 1)
  which jq || (echo "Please install 'jq' package" && exit 1)
  which yq || (echo "Please install 'yq' package" && exit 1)

  $(eval templates := $(shell cat ${FUNC_FILE} | yq r - -j | jq -r '.functions | values[].lang'))

  for template in $(templates) ; do \
    faas-cli template store pull $$template ; \
  done
.PHONY: templates
```

Run `make templates` to download all the templates you need.

We now need a `functions.yml` in the root of your project. This is what we're
using as the definition of all the functions we're writing. This is the exact
same format as the OpenFaaS yaml file.

```yaml
version: 1.0
provider:
  name: openfaas
functions: {}
```

## Language Implementations

### Node12

**functions.yml**

```yaml
version: 1.0
provider:
  name: openfaas
functions:
  node12:
    lang: node12
    handler: ./functions/node12
    image: node12:latest
```

**docker-compose.yml**

```yaml
version: '3.7'
services:
  node12:
    build:
      context: ./template/node12
    ports:
      - 3000:3000
    environment:
      fprocess: nodemon index.js
    secrets:
      - example
    volumes:
      - ./functions/node12:/home/app/function
    user: root
    command: sh -c "npm i -g nodemon && fwatchdog"

secrets:
  my-secret:
    file: ./secrets/example
```

To get live reload in NodeJS we use the [nodemon](https://nodemon.io/) application.
If you've ever done any NodeJS work, it's incredibly likely that you'll have used
nodemon as it works really **REALLY** well.

### Python3-Flask

**functions.yml**

```yaml
version: 1.0
provider:
  name: openfaas
functions:
  python3-flask:
    lang: python3-flask
    handler: ./functions/python3-flask
    image: python:latest
```

**docker-compose.yml**

```yaml
version: '3.7'
services:
  python3-flask:
    build:
      context: ./template/python3-flask
    ports:
      - 3001:8080
    environment:
      FLASK_APP: /home/app/index.py
      FLASK_ENV: development
      fprocess: flask run
    volumes:
      - ./functions/python3-flask:/home/app/function
    user: root
```

Unlike the `node12` template, we don't need to install any dependencies at
runtime. The `fprocess` needs to use `flask`, which is already installed as
that's the framework used in this template. I've kept the `user` as `root`
for consistency, but it probably isn't actually necessary.

### GoLang-HTTP

**functions.yml**

```yaml
version: 1.0
provider:
  name: openfaas
functions:
  golang-http:
    lang: golang-http
    handler: ./functions/golang-http
    image: golang-http:latest
```

**docker-compose.yml**

```yaml
version: '3.7'
services:
  golang-http:
    build:
      context: ./template/golang-http
      target: build
    ports:
      - 3002:8080
    environment:
      fprocess: air -c /go/src/handler/function/.air.toml
      mode: http
      upstream_url: http://127.0.0.1:8082
    volumes:
      - ./functions/golang-http:/go/src/handler/function
    command: sh -c "go get -u github.com/cosmtrek/air && fwatchdog"
```

This one is a little more involved than NodeJS/Python because the Go template
builds a binary and puts it into an empty Alpine container. We have to intercept
the build process to use the GoLang template by setting the `build.target` parameter
to `build` (see [Docker Multi-Stage builds](https://docs.docker.com/develop/develop-images/multistage-build/)
for more information). As the OpenFaaS configuration is done in the final container,
we need to apply this configuration to the `build` target. This means setting the
`mode` and `upstream_url` environment variables.

Finally, this uses the Go package [Air](https://github.com/cosmtrek/air) to provide
the live reload facility. This requires a config file, even if there's nothing inside
it. As we won't need this in production, there's a `.dockerignore` file to not send
it to the image when building. However, the Docker Compose `volumes` ignores this,
which is exactly what we need.

## Next Steps

I want to write a version for this for each officially supported OpenFaaS template
in the template store. If you want to help with that, please fork the repo and add
a PR.

GoLang (now done) and CSharp are the ones I'd really like to get done as they seem
to be fairly popular within the community.
