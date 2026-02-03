---
image: /img/blog/pipelines.jpg
title: "Zigflow: The Missing Temporal DSL"
credits: Photo by [Wolfgang Weiser](https://unsplash.com/@hamburgmeinefreundin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: What if Temporal workflows were just YAML? Zigflow introduces a declarative layer that removes boilerplate while keeping all the Temporal goodness.
tags: temporal, dsl, zigflow, workflows, yaml, devtools, opensource
---

**TL;DR**: [Zigflow](https://zigflow.dev?utm_source=simonemms&utm_medium=blog&utm_campaign=intro)
lets you write Temporal workflows in YAML, so you can focus on what happens
instead of how to make it reliable.

---

[Temporal](https://temporal.io?utm_source=simonemms&utm_medium=blog&utm_campaign=intro)
is one of those tools that feels like a superpower once it clicks. Durable workflows,
automatic retries and crash recovery baked in.

But getting there can feel heavy.

Since I joined Temporal last April, I've really seen first-hand how it helps engineers
make their application bullet-proof whilst writing less code.

Last summer, I had a week of customer calls where a common pattern kept repeating.
The whole week, I heard some version of the same thing:

> Temporal is great for developers, but we want our business users to be able to
> define workflows. Is there a DSL we can use?

They loved Temporal for its durability and reliability, but they didn't want
every workflow change to require an engineer, a code review and a deployment. For
them, the workflow wasn't the complexity, but the implementation was.

That tension was the spark for [Zigflow](https://zigflow.dev?utm_source=simonemms&utm_medium=blog&utm_campaign=intro).

## Temporal is powerful, but there is a learning curve

Temporal workflows are just code, but not necessarily _normal_ code. Workflows
are replayed. You have to understand determinism (and non-determinism). Things
that once felt natural have to be reconsidered.

For experienced Temporal users, that's fine. It can even feel elegant.
<br />For newbies, it's a whole new paradigm.

Also, most workflows aren't algorithmically complex:

They're sequences.<br />They branch.<br />They wait.<br />
They call services.<br />They loop.<br />They retry.

Most workflows aren't complex in _what_ they do - they're complex in _how_ they're
made reliable.

## Enter Zigflow

[![Zigflow](/img/blog/zigflow.png)](https://zigflow.dev?utm_source=simonemms&utm_medium=blog&utm_campaign=intro)

[Zigflow](https://zigflow.dev?utm_source=simonemms&utm_medium=blog&utm_campaign=intro)
is a declarative DSL for Temporal workflows.

Instead of writing your workflow code directly, you describe your workflow in
YAML. Zigflow turns that description into a real Temporal workflow with retries,
durability and all the usual Temporal guarantees.

Think of it as a way to start simple with Temporal, without painting yourself in
a corner.

You get all the reliability, observability and scalability without having to
think about the sharp edges on day one.

A DSL (domain-specific language) is a specialised language, focused on the
problem. Rather than inventing yet another DSL, Zigflow builds on the CNCF's
[Serverless Workflow](https://serverlessworkflow.io) specification - a
vendor-neutral standard designed for exactly this problem.

## Show me the money

If you've gotten this far, you'll want to see how it all works.

```yaml
document:
  dsl: 1.0.0
  namespace: zigflow
  name: hello-world
  version: 1.0.0
do:
  - set:
      output:
        as:
          data: ${ . }
      set:
        message: Hello from Ziggy
```

This isn't pseudo-code, but a full Temporal workflow ready to receive triggers.

Run this with the Zigflow CLI (`zigflow -f ./workflow.yaml`) and you've got a
running Temporal workflow. Trigger this from the Temporal UI
(**task queue**: `zigflow` and **workflow type**: `hello-world`) and you'll
see the response:

```json
{
  "data": {
    "message": "Hello from Ziggy"
  }
}
```

The goal of Zigflow isn't low-code for the sake of it, but to allow you to focus
on what the workflow does. And you get the added bonus of Temporal best practices.

## Best practices as guardrails

As a workflow grows, Temporal concepts start to matter:
- Histories get long, so you need Continue-As-New
- Activities get slow, so you need heartbeats
- You want visibility, so you need search attributes

Zigflow bakes all these ideas in from the start, so you don't need to learn them
upfront. You still benefit from them, but they're implemented as sensible defaults
so you only need to know about them when they matter.

And if you know Temporal already, Zigflow becomes a way to standardise and
accelerate workflow creation.

## Written in Go. Not locked to Go

Zigflow is written in Go, but the workflows it runs are just Temporal workflows.

That means they're language-agnostic by nature.

You can trigger them from TypeScript, signal from the Temporal UI, query from
Python and update from Java.

## Why you might want to try it

- You're curious about Temporal, but put off by the learning curve
- You want to prototype workflows fast
- You like the idea of workflows being readable by humans
- You're building tooling or platforms on top of Temporal

If any of this resonates, Zigflow is worth a look:
- 👉 Docs: [zigflow.dev](https://zigflow.dev?utm_source=simonemms&utm_medium=blog&utm_campaign=intro)
- 👉 Code: [github.com/mrsimonemms/zigflow](https://github.com/mrsimonemms/zigflow)

If you try it and like it, please add a GitHub star. I know it's a bit of a
vanity-metric, but it's great seeing feedback from people who are using it. And
that motivates me to keep building.

This is just the beginning and I've got so many ideas about new features (including
a drag-and-drop UI). If this resonates, try it out. And I'm planning a follow-up
post diving into these ideas.

And let me know what you build.
