---
image: /img/blog/pietro-jeng-n6B49lTx7NM-unsplash.jpg
title: Dockerising an R App
credits: Photo by [Pietro Jeng](https://unsplash.com/@pietrozj?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
excerpt: R is great for statistical analysis, but hard to Dockerise. This is how I get round the problems.
tags: kubernetes, docker, devops, containers, r, data science
---

R is a statistical programming language with a huge repository of tools to crunch numbers, manipulate
data and do all manner of data science tasks. I've worked with a couple of teams with data scientists
who use it and love it. Which is great, except for one problem.

R is a pain in the arse to Dockerise.

One irritating, but not insurmountable problem is the lack of official templates for R. Personally,
I tend to stick to the official templates built by Docker which I then extend. That way you know
that they're safe to use, are built to proper standards and are kept (reasonably) up-to-date.
Fortunately, there is the [Rocker](https://hub.docker.com/u/rocker) organisation that maintains a
series of images that you can use.

However, the biggest pain point by far is dependency management and the final size of the images.
By design, when using [RStudio](https://rstudio.com/) developers will typically install dependencies
at runtime. Here, that's fine because it's a development environment. When you're containerising your
R app, this is not acceptable as containers should be immutable, pre-compiled and fast-loading. Some
of these dependencies take many **MINUTES** to download, compile and install.

![Largest mass in the universe](/img/blog/node_modules.jpg "Largest mass in the universe")

And R dependencies are big. Really big. If you thought `node_modules` was big, R is something else.
I recently developed a fairly simple R app for the [British Red Cross](https://github.com/britishredcrosssociety/local-lockdown)
and the final image size was over 2GB (yes, that's **GIGABYTES**). Rocker don't provide an Alpine
image which doesn't help, but I don't think that's a big problem due to the size of the dependencies
and even R itself. Rocker's [r-base](https://hub.docker.com/r/rocker/r-base) image comes out at
over 800MB. This is built on [debian](https://hub.docker.com/_/debian) which is 118MB - using Alpine
would only reduce that by 100MB which, seeing as the R base is over 700MB, hardly seems worth the
effort.

There are other issues with R dependencies. With NodeJS you have your `package.json`, with Python
you have your `requirements.txt`. R doesn't really have any matching concept (although there are
some [workarounds](https://stackoverflow.com/questions/38928326/is-there-something-like-requirements-txt-for-r))
so you have to maintain your dependencies in both your `Dockerfile` and where you call it in your
R app.

Finally, any dependencies that you need in your OS are not installed. This is fairly standard, but
the default behaviour of the installer is to exit without an error which is incredibly frustrating.

## So, how do you do it then?

The key to installing the dependencies is the `install2.r` application which is bundled with all
Rocker images. This installs dependencies from the [CRAN installation repository](https://cran.r-project.org/web/packages/).
There is also a corresponding `installGithub.r` binary which installs dependencies from GitHub.

In your `*.R` files, you will use the `library()` function to call your dependencies at the top of
the script. Basically, every time you use it, you need to update your `Dockerfile` with each
dependency. Yes, it's a pain to do it each time, but that's what you have to do.

```r
library(dplyr)
library(readr)
```

### install2.r

As mentioned above, this doesn't error by default. It'll print the errors in the logs (along with lots
of other things) so you'll never know if the build has failed. Therefore, you need to use the `--error`
flag with this.

There is also a `--skipinstalled` flag which stops reinstalling any dependency that's already present
in the system.

### installGithub.r

Again, make sure you pass the `--error` flag otherwise any errors won't break the build.

Typically, you wouldn't need to use this. I only had to use this for the Red Cross because of an
bug with the latest version of Tidyverse when using Ubuntu 18.04 (which is the basis of the R image).
I would only suggest using this if you need to install a specific version of a dependency, because I
can't work out how to do that with `install2.r`.

One final note, this requires `remotes` to be installed. So you will need to run
`install2.r --error remotes` before installing anything with `installGithub.r`.

## Full Dockerfile example

This is an example using Shiny server.

```dockerfile
FROM rocker/shiny:3.6.3
COPY . ./src/shiny-server

# Install any OS dependencies - this is just an example and not required for these dependencies
RUN apt-get update \
    && apt-get install -y libudunits2-dev

# List of dependencies - ensure corresponds with `library()` calls in *.R files
RUN install2.r --error \
    --skipinstalled \
    readr \
    dplyr

USER shiny
```

Once you're here, the usual Docker command of `docker build -t r-app .` will build this `Dockerfile`
into your image.
