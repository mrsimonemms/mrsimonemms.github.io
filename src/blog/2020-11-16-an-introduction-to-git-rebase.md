---
image: /img/blog/lance-grandahl-nShLC-WruxQ-unsplash.jpg
title: An introduction to Git Rebase
credits: Photo by [Lance Grandahl](https://unsplash.com/@lg17?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText)
excerpt: Git rebase is one of the most complex things to get your head around. But, by following a few simple steps, you can master it.
tags: git, devops, repository
---

> This post assumes some familiarity with Git. This is an advanced concept and shouldn't be tried
> as your first foray into Git and version control.

During development on a feature branch, there will be times when we need to update our branch
because the `master` branch has received an update. In order to keep a linear Git history, avoid
using the `git merge master` command.

Having a linear history is more work, but it offers some advantages over a merge:
 - much easier to find the true source of a commit
 - no "merge commit" messages taking up space
 - reduced opportunity for conflicts
 - easier to revert a commit that's not been introduced as part of a pull request

## Introducing Git Rebase

The `git rebase master` command is what we need to use instead.

```text
# Assume you're in a branch feature/my-wonderful-feature
git checkout master
git pull
git checkout - # or git checkout feature/my-wonderful-feature
git rebase master
git push --force
```

If there are any issues, you can always use `git rebase --abort`.

## What is Git Rebase?

> "This is the way it should have gone"

Git rebase is a way of rewriting your history. At a simple level, it unwinds all your commits to the
last common commit with your branch, applies the `master` commits and then puts your commits after
them.

By contrast, `git merge master` would create a merge commit **AFTER** your commits. When your
feature branch gets promoted to the `master` branch, you will end up with merge commits polluting
the history.

## Using Git Rebase to squash commits

In a feature branch, there will often be commits in your log like this (`git log --oneline`):

```text
067c88e gah, I'm stupid. I can see why CI broke
bf2a09e erm, not sure why CI has broken so another go
7fa9388 (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
d4193f5 (master) fix(some-fix): some fix
```

We've all been there. CI/CD pipelines can be a pain to get right. These commits are fine in a
feature branch, but we don't want these littering the history in `master` - a feature branch should
be the work we did, logically separated into "good" commits (it makes finding problems later much,
much easier).

> It's a good idea to create a backup branch. With a Git Rebase, you are changing the branch
>irreparably.Run `git checkout -b backup/my-wonderful-feature` to create a backup.

Run `git rebase -i HEAD~3` to get the 3 latest commits - the `3` can be changed to anything, but you
shouldn't go beyond the last common commit (in this case `d4193f5`)

This will present an interactive screen that looks like this:

> NB. The latest commit is at the bottom.

```text
pick 7fa9388 (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
pick bf2a09e erm, not sure why CI has broken so another go
pick 067c88e gah, I'm stupid. I can see why CI broke

# Rebase f4b6d01..9249bd0 onto f4b6d01 (3 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup <commit> = like "squash", but discard this commit's log message
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified). Use -c <commit> to reword the commit message.
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
```

You can now change your history. In our example, we want to combine all the commits together - this
is the `fixup` command. Change the file so that it looks like this:

```text
pick 7fa9388 (feature/my-wonderful-feature): feat(some-brilliant-feat): this is a brilliant feature I've worked hard on
f bf2a09e erm, not sure why CI has broken so another go
f 067c88e gah, I'm stupid. I can see why CI broke
```

Now save your changes and exit. If you now look at `git log --oneline`, you will see that only the
first commit exists. You can now run `git push --force` to replace your remote branch with your
local branch.

You can also use this method for doing other things. Generally, I find that I use the `pick`, `reword`
and `fixup` commands the most, although I also find `edit` and `squash` useful for editing my history
before submitting a change.
