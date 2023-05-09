---
image: /img/blog/jordan-harrison-40XgDxBfYXM-unsplash.jpg
title: Self-Hosted is dead - long live Self-Hosted
credits: Photo by [Jordan Harrison](https://unsplash.com/@jordanharrison?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: Gitpod may have deprecated support for self-hosted, but that's no reason to let it die
tags: gitpod, self-hosted, commmunity, hetzner
---

Gitpod may have deprecated support for self-hosted, but that's no reason to let
it die. I've created a [Gitpod Self-Hosted](https://github.com/mrsimonemms/gitpod-self-hosted)
community installation repository to fly the flag for those of us who want and need
self-hosted.

---

Regular readers will know that I worked at [Gitpod](https://www.gitpod.io) until
[a couple of weeks ago](https://simonemms.com/blog/2023/01/28/i-am-an-ex-podder).
Whilst I was there, I provided the technical leadership on the self-hosted offering.
I planned and built the Gitpod Installer to [remove the complexity of our old Helm
charts](https://www.gitpod.io/blog/gitpod-installer), worked with
[Replicated](https://www.replicated.com) to package it for public consumption and
various other odds and sods.

In December, [Gitpod pulled official support for self-hosted](https://www.gitpod.io/blog/introducing-gitpod-dedicated).
For anyone who worked alongside me at Gitpod or worked with me in
the [Gitpod community](https://www.gitpod.io/community), you will be aware that
I had reservations about this as a strategy. I'm not going to get into the detail
of that here (I may do so publicly in the future), but there's a couple of highlights
that are appropriate to call out:
 - Gitpod SaaS works well - this is the shop-window and how the majority of people
will interact with it
 - A [managed Gitpod service](https://www.gitpod.io/dedicated) is a good idea (and
something I argued in favour of over a year ago)
 - Dropping self-hosted excludes a whole host of hobbyists and champions, who were
crucial to getting Gitpod to where it is today
 - It removes Gitpod as a viable option for businesses who need to guarantee things
like data sovereignty, access policies or other compliance policies (Dedicated does
this, but there will still be those for whom requiring the guarantees will be cost/time-prohibitive,
so will insist on on-premise or nothing)
 - Dedicated will be significantly more expensive than Self-Hosted

## [This Town Ain't Big Enough For The Both Of Us](https://www.youtube.com/watch?v=eUJ_ifjKopM)

Gitpod is difficult to run. It is a Kubernetes application that builds it's own
images. It provides access to the Docker socket so that Docker can be used inside
it. In order to do this and maintain security and isolation between workspaces,
lots of work has been done to make this happen.

This means you can't just get any old Kubernetes instance and run it. Anyone who's
thought "oooh, I'll spin up minikube and have a play with Gitpod for half an hour"
will know that it doesn't work like that.

Gitpod.io runs on [k3s](https://k3s.io). It used to run on [Google's GKE](https://cloud.google.com/kubernetes-engine),
but it was found to have certain limitations that meant that it wouldn't run reliably
on it. In self-hosted though, we supported GKE. And [EKS](https://aws.amazon.com/eks).
And [AKS](https://azure.microsoft.com/en-gb/products/kubernetes-service). Strangely,
we didn't officially support k3s (although I had created a [k3s guide](https://github.com/MrSimonEmms/gitpod-k3s-guide)
which was quite popular in the community). But that means we were officially supporting
four times the number of distributions, including one that we couldn't get to work
reliably for our own paid service.

Gitpod also needs nodes that run on [Ubuntu 20.04](https://releases.ubuntu.com/focal).
And the nodes could have [the `shiftfs` module](https://github.com/toby63/shiftfs-dkms)
enabled, or use [`FUSE`](https://www.kernel.org/doc/html/latest/filesystems/fuse.html)
if it wasn't. And then there was in-cluster or external database/registry/storage.

And that's not counting the number of times where a feature was added that would
have added more requirements on the nodes, such as the time a PR was opened that
changed all the persistent volume claims to use a feature that was only available
on Google Cloud Platform.

This meant that we were supporting a matrix of many permutations. For a team of
four engineers, that was a big task.

It also meant that Self-Hosted was actually slowing down Gitpod's progression. A
good example of this is [gitpod-io/gitpod#14005](https://github.com/gitpod-io/gitpod/pull/14005).
This is a pull request to drop support for `FUSE`. [Alejandro](https://github.com/aledbf)
(rightly) said that "Ubuntu stable already provides `shiftfs` OOTB", but what that
didn't take it account of was that the managed Kubernetes nodes didn't necessarily
have it enabled. In both GKE and AKS, `shiftfs` wasn't actually enabled by default.
So the ticket lay fallow for months, with no one really happy with this state of
affairs.

This had a practical benefit to Gitpod. By only supporting `shiftfs`, the complexity
of the installation would reduce, the image build speeds would dramatically increase
and everyone would be happy.

Except those customers of GKE and AKS...

## [Bright Idea](https://www.youtube.com/watch?v=3KGypBFyaQQ)

There are two broad schools of thought for on-premise applications:
 1. provide support for a wide-range of features, potentially limiting the deployment
 options
 2. provide support for a wide-range of deployment options, potentially limiting
 the features

Historically, Gitpod fell into the first camp as it was felt that by providing lots
of deployment options, we'd get the most customers. Towards the end of 2022, it
became clear that this was actually hurting us.

For much of my last 6 months at Gitpod, I was advocating an approach where we limit
our deployment options. Instead of supporting the managed Kubernetes of all the
major cloud providers, we should only support specific versions of k3s. Our job
in the Self-Hosted team would then be:
 - maintaining the known images of Ubuntu
 - maintaining ways of autoscaling the VMs in those cloud providers
 - being able to provide well-tested and reliable instructions to our users

A few weeks before I left, I spoke to one of my teammates and they said:

> If you think you're so clever, why not build a proof-of-concept?

[So I did](https://github.com/mrsimonemms/gitpod-self-hosted).

And, just because I'm no longer a Gitpodder, I'm still a lover of Gitpod so I
continued working on it after I left (that's normal right?).

At this stage, it only has support for [Hetzner](https://www.hetzner.com) as this
is what I use (it's cheap as chips, fast and reliable), but there's plans to add
more cloud providers in future. Importantly, we have control of the configuration
of the Kubernetes runtime and the configuration of the nodes that these run on.

It creates a pool of Kubernetes managers and a pool of Kubernetes nodes. In a typical
managed instance, you don't actually have access to the managers (usually known
as the control-plane) and you only have access to the nodes. But, because this is
k3s, you have access to both. Once Terraform has created the managers, it installs
k3s to them.

When you're scaling a cluster, you typically wouldn't be scaling the control-plane
because these would not normally have any Gitpod resources on them. So, when you
scale, you're adding new nodes.

Both the managers and nodes make use of [cloud-init](https://cloudinit.readthedocs.io/en/latest/)
scripts to configure the node for us, which means we don't actually need to do anything
clever like creating base images in [Packer](https://www.packer.io/). For the
[manager VMs](https://github.com/mrsimonemms/gitpod-self-hosted/blob/main/cloud-init/k3s_manager.yaml),
the cloud-init script installs the required packages, change the SSH port from `22`
(Gitpod needs port `22` for it's own SSH access) and installs `shiftfs`. For the
[nodes](https://github.com/mrsimonemms/gitpod-self-hosted/blob/main/cloud-init/k3s_node.yaml)
it does exactly the same and then installs k3s and connects it to the manager pool.

The reason that the cloud-init script has the k3s connection information? So that
we can add a new node via autoscaling without needing someone to run the Terraform
scripts. Importantly, creating a new VM from scratch only takes about a minute or
so, which is about the same amount of time that most managed Kubernetes services
take to provision a new node.

## [I Am The Resurrection](https://www.youtube.com/watch?v=vWP54WPwYlI)

I don't know where I'm going with this project in truth. I'm a passionate and empathetic
engineer, so I can't just turn off the taps on something that was my entire working
life for the past 18 months. I guess if it had ended on my terms, then that's one
thing - by being made redundant, I finished mid-ticket and I had the very hollow
feeling of unfinished business.

I worked bloody hard to make Gitpod Self-Hosted a success and I hated seeing that
it wasn't as successful as it should have been. Gitpod is an open-source project,
so this could well become a vibrant, community-remix of Gitpod. Equally, it could
just be something I do for myself. I have no influence over the technical direction
of Gitpod any more, so I guess this could all be closed down very quickly if they
don't want it to exist any more.

It's unlikely that I'll do work on other cloud providers just because. I use Hetzner
and this works well for me. If you want me to open up other cloud providers, I will
want sponsoring for this effort (and access to an account for the desired cloud)
so that I'm not funding development of a commercial, [VC-backed](https://www.gitpod.io/blog/future-of-software-cdes)
company that recently decided it couldn't afford me any more. I love Gitpod and
it's community, but maybe not that much.

I will be writing some extensive documentation for the project over the next few
weeks, so please keep an eye on the project. And, if you want to discuss me working
on additional cloud providers, please put a call in my [diary](https://diary.simonemms.com)
so we can discuss things.

## Resources

- GitHub repository: [github.com/mrsimonemms/gitpod-self-hosted](https://github.com/mrsimonemms/gitpod-self-hosted)
- Actual usage: [github.com/mrsimonemms/gitpod-app](https://github.com/mrSimonEmms/gitpod-app)
