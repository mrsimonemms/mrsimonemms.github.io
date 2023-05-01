---
image: /img/blog/volodymyr-hryshchenko-L0oJ4Dlfyuo-unsplash.jpg
title: Building a RESTful API With Functions
credits: Photo by [Volodymyr Hryshchenko](https://unsplash.com/@lunarts)
excerpt: Serverless functions are a great way of building a scalable application, but often a RESTful API is easier when building a complex application. Let's combine the two.
tags: cloud native, kong, kubernetes, devops, containers, openfaas, serverless, functions
---

> There is an accompanying [GitHub registry](https://github.com/MrSimonEmms/openfaas-rest-api) with
> a working demo

Serverless functions are a great way of building a scalable application. They're small, independent,
fast-to-build and infinitely scalable. If you need to build an application with just a couple of
endpoints, they will work great.

When it comes to building a big application or one that you want to expose as a public service,
serverless functions can end up being just a bit cumbersome to develop. As most serverless frameworks
focus on single functions, there can be a lot of repetition in getting a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)
application set up.

## What is a RESTful application?

> For more information, check out the [Wikipedia article](https://en.wikipedia.org/wiki/Representational_state_transfer).

REST (Representational state transfer) is a way of representing data between machines. It has a
several key features:
 - no session state is maintained between calls
 - the HTTP verb decides how the request is handled
 - it returns the data model

## What tech are we using?

Whilst there's plenty of open-source tech out there that can help, this is my favoured way of achieving
the end goal:
 - [OpenFaaS](https://www.openfaas.com) for the serverless functions
 - [Kong](https://konghq.com/kong) for the API gateway
 - [Kubernetes](https://kubernetes.io) and [Helm](https://helm.sh) for deployment
 - [K3d](https://k3d.io) and [Skaffold](https://skaffold.dev) for local development
 - A [custom NodeJS OpenFaaS template](https://gitlab.com/MrSimonEmms/openfaas-templates/-/tree/master/template/mongoose-crud)
that uses [MongoDB](https://www.mongodb.com) and  [Mongoose](https://mongoosejs.com) to manage the data models

## Getting started

As I like to keep things simple, all you need to do to get the development cluster up and running is
to run `make`. This will run a series of commands to check you have the correct dependencies, create
your k3d cluster and provision your cluster. Once you've done that, you can access your cluster on
[localhost:9999](http://localhost:9999).

Once you've got the cluster up and running, you can just use `make serve` to reload the Kubernetes
objects.

## Your first function

> In the example repo, look at the `product` function as the first function

To create your first function, run the command `FN_NAME=product make new`. This will create a new
OpenFaaS function in the `/components` directory.

The important file is `schema.js` which is a standard [Mongoose schema](https://mongoosejs.com/docs/guide.html).
In this example, we're just defining a `modelName` of `Product` - in a more complex example, we can
add in both synchronous and asynchronous validation, but a simple name property will do for now.

```javascript
module.exports = ({ model }, BaseSchema) => {
  const modelName = 'Product';

  const ProductSchema = new BaseSchema({
    name: {
      type: String,
      required: true,
    },
  });

  return model(modelName, ProductSchema);
};
```

Next, add this to the `functions` Helm chart in `/chart/functions/values.yaml`.

```yaml
functions:
  product:
    image:
      repository: ghcr.io/mrsimonemms/openfaas-rest-api/product
      tag: latest
    envvars:
      LOGGER_LEVEL: info
      MONGODB_URL: "mongodb://openfaas-mongodb.openfaas.svc.cluster.local:27017/openfaas"
```

Finally, add the `image` to the `artifactOverrides` section in the `skaffold.yaml` file.

```yaml
artifactOverrides:
  functions:
    product:
      image: ghcr.io/mrsimonemms/openfaas-rest-api/product
```

If you visit the [OpenFaaS dashboard](http://localhost:8080), you will see the `product` function
has been deployed to OpeenFaaS.

> To get the login credentials, run `make openfaas`

## Making it into an endpoint

Now we have an OpenFaaS function running, we need to configure Kong so that it acts as a gateway.
OpenFaaS functions are exposed on `/function/:name`, which is what we're going to redirect to - in
this template, the [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) endpoints
live under `/crud`.

First, in `/charts/openfaas/values.yaml`, add a `product-gateway` service:

```yaml
services:
  - name: product-gateway
    annotations:
      konghq.com/path: /function/product/crud
```

Finally, in the `/charts/openfaas/template/ingress.yaml`, tell the Kong ingress about the `product-gateway`
service:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: openfaas
  annotations:
    konghq.com/strip-path: "true"
spec:
  ingressClassName: kong
  rules:
    - http:
        paths:
          - path: /api/v1/product
            pathType: Prefix
            backend:
              service:
                name: product-gateway
                port:
                  name: http
```

Now you'll find this exposed on [localhost:9999/api/v1/product](http://localhost:9999/api/v1/product).

## Your second function and nested endpoints

> In the example, this is the `product-size` function

So far, we've done a fairly simple example only. Next, we're going to up the complexity by adding a
nested endpoint. A root endpoint is fairly straightforward because it just sends everything to the
function and returns whatever that returns.

Conversely, a nested endpoint is locked to a product ID. Fortunately, Kong makes this fairly straightforward
for us with its plugin system.

Firstly, repeat all the above steps to create a `product-size` function. In the `schema.js`, add a
`productId` parameter - this will store the `_id` from the `product` function.

This time, when creating the `/charts/openfaas/template/ingress.yaml`, we're going to add a named path
parameter in the `path`.

```yaml
- path: /api/v1/product/(?<productId>[\w-]+)/size
  pathType: Prefix
  backend:
    service:
      name: product-size-gateway
      port:
        name: http
```

This searches for any alphanumeric character between `/product/` and `/size` in the URL and assigns
it the name `productId`.

Next, we have to tell it what to do with it. In the `/charts/openfaas/values.yaml`, add this to the
`services` array:

```yaml
- name: product-size-gateway
  annotations:
    konghq.com/path: /function/productsize/crud
    konghq.com/plugins: product-request-transformer
```

Notice how this refers to a `product-request-transformer` plugin. So, let's define it in the same
`values.yaml` file.

```yaml
plugins:
  - name: product-request-transformer
    plugin: request-transformer
    config:
      remove:
        body:
          - productId
      add:
        body:
          - productId:$(uri_captures["productId"])
      append:
        querystring:
          - filter:productId||$eq||$(uri_captures["productId"])
```

This does a few things. Firstly, it removes any `productId` from the body and then adds in the
product ID in the URL.  It also appends a query string `filter=productId||$eq||<productId>` to the
URL. This ensures that the `product-size` function behaves like a nested API endpoint.

Importantly, this won't return an HTTP 404 result if the `product` doesn't exist. That's beyond the
scope of this demo, although you could achieve this by adding a `middleware.js` file to the function.
This can be either a function or an array of functions and it follows the same basic interface as an
[Express middleware function](https://expressjs.com/en/guide/writing-middleware.html).

## Conclusion

With this simple demo, you can see that it's very possible to create a fully RESTful API from a
collection of serverless functions. It's important to remember that all these functions are entirely
isolated from each other from a coding point of view (so you could even do something interesting like
writing them in different languages). This makes them very powerful and almost infinitely scalable.
