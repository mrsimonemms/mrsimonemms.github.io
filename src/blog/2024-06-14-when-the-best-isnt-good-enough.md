---
image: /img/blog/beekeeping.jpg
title: When "The Best" isn't good enough
credits: Photo of me, taken by my wife
excerpt: We often frame questions by asking "what the best X?". Maybe we need to learn to ask better questions.
tags: culture, development, questions
---

I am a beekeeper.

This won't be of much surprise to anyone who's spent any time with me, or who
follows [@TheShroppieBeek](https://twitter.com/theshroppiebeek) on the
[Information Superhighway](https://en.wikipedia.org/wiki/Information_superhighway).
I'll bore for England on the subject of beekeeping. One thing beekeepers often
say to each other is:

> Ask a beekeeper a question and get two answers

A question that might seem simple, such as "what's the best way of raising a new
queen?", will come with a multitude of opinions, folklore and experience. You might
ask a fan of the [Miller Method](http://www.dave-cushman.net/bee/millermethod.html),
or a lover of [Grafting](https://www.youtube.com/watch?v=PJ_79D1ASlg) or someone
who likes using any of the other methods.

The problem here is asking for "The Best". How do we know it's "The Best"? When I
say "The Best", I'm looking for the easiest way of doing it. When you hear "The
Best", you might think I'm looking for the most reliable way of doing it. These
are subtly different things.

My setup will be different to the person I'm asking:
- I have six hives over two apiaries
- I'm a hobbyist
- it's not my main income, so I don't need to turn a profit
- my bees are all fairly sheltered from the wind
- my bees all have south or east-facing entrances
- my bees are all around ~130 metres above sea-level
- my bees are all around 52°N
- I select my bees for calmness rather than productivity
- I use wooden, National boxes

The person I ask almost certainly won't keep bees in an identical fashion to me.
And, even if they did, they will have a natural odour, style and demeanour which
the bees will pick up on and react differently to. So if I ask for "The Best", I'm
assuming that they will know all about my bees and that there's will be the same.

Which is why you end up getting two answers from one beekeeper.

## "The Best" in software engineering

We see a similar behaviour in software engineering. I have been regularly asked
for "The Best" without giving any other answers.

Let's examine the question "what's The Best cloud provider?", which is a question
I'm asked with depressing regularity. Defining "The Best" is actually quite
difficult:
- do you need a truly global application (including Africa and South America), or
  do you just need Europe and North America?
- are you using a VPN, or will everything be accessed over the public internet?
- are you going to be having vast quantities of traffic/data, or is it only going
  to be a few gigabytes per month?
- do you need to use Windows machines, or is everything on Linux?
- do you need managed Kubernetes, or are you comfortable using K3s?
- do you have any specialist requirements (like a [satellite](https://aws.amazon.com/ground-station)),
  or are you just deploying some containers and storing data?
- is money no object, or do you need to watch the pennies?

These are just some of the questions that need to be answered in order to give
an answer to the question. In my mind, I divide up the cloud providers into
"The Establishment" (AWS, GCP, Azure) and "The Challengers" (DigitalOcean, Civo,
Hetzner and others). For (most of) the questions I asked, the first part is
something that The Establishment caters for (and does well), but the second part
is something that everyone does well.

Tell me the things that matter to you and I'll be able to give an intelligent
answer.

## Define your parameters

I've regularly run post-mortems in my capacity as a technical leader. I often
end them by talking of better questions that we can ask in future to avoid the
situation that's gone wrong. Telling me how you just "The Best" is useful in
helping me understand the question you're actually asking.

Instead of asking for "The Best", trying asking  a better question:

- my goal is _X_. What are the different ways I could achieve this?
- am I on the right tracks with this? Are there any things I need to watch out
  for?
- I want to avoid _X_ - how might you do it?
- I'm doing a proof of concept that I want to move into production - what should
  I watch out for?
- I want to put this application on the internet - how are we doing it for other
  things like this?

## The exception that proves the rule

Of course, there are always exceptions. If you ask an
[eager-to-please comedian](https://www.joshwiddicombe.com/) to buy The Taskmaster
"the best present", you might just get them to get a tattoo whilst filming an
unbroadcast show on a channel known for just showing repeats.

And comedy gold ensues.

**NB.** If you're [Little Alex Horne](https://en.wikipedia.org/wiki/Alex_Horne)
reading this, please keep asking comedians/intelligent idiots for "The Best".
The vagueness is what actually means makes for varied, interesting and funny TV.

<iframe style="display: block; margin: 0 auto" width="560" height="315"
 src="https://www.youtube.com/embed/KLSXsxRQyhE?si=U-nupvYMnj6Saz8T&amp;start=426"
 title="YouTube video player"
 frameborder="0"
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
 picture-in-picture; web-share"
 referrerpolicy="strict-origin-when-cross-origin"
 allowfullscreen></iframe>
