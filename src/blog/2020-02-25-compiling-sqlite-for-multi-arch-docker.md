---
image: /img/blog/devon-divine-Hzp-1ua8DVE-unsplash.jpg
title: Compiling SQLite for Multi-Arch Docker
credits: >-
  Photo by [Devon
  Divine](https://unsplash.com/@lightrisephotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >-
  Multi-arch containers are great, except when you have C/C++ bindings to deal
  with. SQLite is one of the more common packages so I'll show you how to
  massively speed up your build process.
tags: 'kubernetes, docker, devops, containers'
---
Recently, I wrote about [building Docker containers for different processor
architectures](/blog/2020/01/21/multi-arch-docker-container) in order to be able
to run containers on Raspberry Pis and similar. As in that article, that's very
useful for being able to benefit from cheaper cloud space or speed up development
for Internet of Things (IoT) devices.

As NodeJS is an interpreted language (or transpiled, in the case of TypeScript),
you will rarely be compiling your files into a binary and most of the npm packages
you will work with will also be simple JS files. One obvious exception is if you
intend to use [SQLite3](https://www.npmjs.com/package/sqlite3).

## Why use SQLite

SQLite is a great little database when used correctly. It requires very little
resources to run so a perfect choice if you wish to have a database on your
device - handy for either IoT applications or if you have a small app where an
external database is more hassle than it's worth. It also uses a single file, access
and backup is simple. Sure it has drawbacks too, but often these are only a problem
when you need to scale-up.

## What's the problem

The SQLite3 package has C/C++ bindings. Unlike NodeJS, C/C++ is a compiled language
which needs a binary and that is linked to your processor architecture. The SQLite3
maintainers do provide some pre-built binaries, but none for the Raspberry Pi.

As well as having to build the SQLite3 npm package, there is also a dependency on
the SQLite package for your machine. The default search location for this is in
a different place to where the `npm install` script looks. So it compiles this during
the install process - on an emulated ARM Docker container, this can take a long
time. In some of my repos, I'm seeing this lasting over an hour.

This is clearly not a sustainable solution.

## What's the solution

> The source files for this example are available on
> [GitLab](https://gitlab.com/mrsimonemms/docker-node-sqlite-mutli-arch)

The solution is to remove the SQLite3 package from your npm dependencies during
your `npm install` process, install the SQLite package for your operating system
and build the bindings manually.

This assumes an Alpine container (the `arm32v6` image only uses Alpine) but it's
the same idea if using a different operating system. In your `Dockerfile`, you will
need to input this blob of code:

```dockerfile
RUN apk add --no-cache g++ git jq make python sqlite sqlite-dev \
  && NODE_SQLITE_VERSION=$(cat node_modules/sqlite3/package.json | jq '.version' --raw-output) \
  && npm un sqlite3 -S \
  && npm i --production \
  && wget https://github.com/mapbox/node-sqlite3/archive/v${NODE_SQLITE_VERSION}.zip -O /opt/sqlite3.zip \
  && mkdir -p /opt/sqlite3 \
  && unzip /opt/sqlite3.zip -d /opt/sqlite3 \
  && cd /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} \
  && npm install \
  && ./node_modules/.bin/node-pre-gyp install --fallback-to-build --build-from-source --sqlite=/usr/bin --python=$(which python) \
  && mv /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} /opt/app/node_modules/sqlite3 \
  && apk del g++ git jq make python \
  && rm -Rf /opt/sqlite3 /opt/sqlite3.zip
```

It's quite sizeable, so let's go through each section individually:

### Install your dependencies

```shell
apk add --no-cache g++ git jq make python sqlite sqlite-dev
```

In order to compile the bindings, you need `g++ make python sqlite-dev`. `sqlite`
is required in the container. `jq` is required by this process. `git` is sometimes
required by install dependencies.

### Get the SQLite3 version

```shell
NODE_SQLITE_VERSION=$(cat node_modules/sqlite3/package.json | jq '.version' --raw-output)
```

We need to find the GitHub release URL of the version that npm installed. In order
to do that, we use `jq` to find the version that was downloaded. We will use this
later when downloading from GitHub

### Remove SQLite3 from your application

```shell
npm un sqlite3 -S && npm i --production
```

We need to now remove `sqlite3` package from your container. Because of the `install`
command, if we kept it in it would start to compile everything. As good practice,
I install all my `dependencies` from my `package.json` - this will be the same as
your normal ones, with the exception of `sqlite3`.

### Download SQLite3

```shell
wget https://github.com/mapbox/node-sqlite3/archive/v${NODE_SQLITE_VERSION}.zip -O /opt/sqlite3.zip \
  && mkdir -p /opt/sqlite3 \
  && unzip /opt/sqlite3.zip -d /opt/sqlite3
```

This downloads the release from GitHub and extracts it to `/opt/sqlite3`. This will
become the compiled SQLite3 bindings that we'll eventually use in our container.

### Compile SQLite3

```shell
cd /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} \
  && npm install \
  && ./node_modules/.bin/node-pre-gyp install --fallback-to-build --build-from-source --sqlite=/usr/bin --python=$(which python)
```

This is the big one. This installs the dependencies and compiles the bindings. This
will take about 3-5 minutes to compile - still, this is a big improvement on my
previous experience of over an hour.

> NB. This is slightly different from the [README](https://www.npmjs.com/package/sqlite3#source-install)
> as I found that `npm install --build-from-source` didn't actually run the
> compilation. This is copied from the `install` script in `package.json`

### Add to the application

```shell
mv /opt/sqlite3/node-sqlite3-${NODE_SQLITE_VERSION} /opt/app/node_modules/sqlite3
```

Now the bindings are compiled, they need to be put into our application (which is
at `/opt/app`)

### Cleanup

```shell
apk del g++ git jq make python \
  && rm -Rf /opt/sqlite3 /opt/sqlite3.zip
```

As a good developer, we need to clean up after ourselves. Remove all the dependencies
that are no longer required and the files/folders we've finished with. Although
they're small, Alpine containers are designed to be as small as possible.

---

Now you will have a fully-built version of the SQLite3 npm package inside your
container that only took a fraction of the time to install. It uses an official
release as well, so there's no issue with undocumented/broken features getting into
your application.

This process can also be used for other packages with C/C++ bindings.
