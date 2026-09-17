---
layout: post
title: "Reading the diff: a PM's guide to code review"
tags: [engineering, code]
---

There's a version of the PM-reads-code idea that goes badly: the PM leaves style
nitpicks on a pull request and everyone quietly starts merging faster to avoid
them. That's not what I mean.

What I mean is that implementation decisions are product decisions wearing
different clothes, and if you never look at the diff, you find out about them in
a bug report six weeks later.

## What's actually worth reading

- Default values. Someone picked 30 days. Why 30?
- Error paths. What does the user see when this fails?
- Empty states. Almost always invented on the spot.
- Anything named `TODO` or `temporary`.
- Copy strings. These ship straight to users and rarely get reviewed by anyone
  who writes.

Here's a real one I caught last month. The retry logic looked fine, but the
user-facing message did not:

```ts
// PM: a user who hits this sees "Error 0x4" and nothing else.
// Can we say what failed and what they should do next?
if (!res.ok) {
  toast.error(`Error ${res.status}`);
  return;
}
```

That's a product bug in an engineering diff. It took one comment and a two-line
change. It would have taken a support ticket and a week if I'd waited for QA.

## How to comment without being annoying

Ask, don't assert. Tag it — I prefix every comment with `PM:` so nobody mistakes
it for a blocking review. And I never leave one on something I couldn't explain
to the author out loud.

> Your job in the diff is to be the person who remembers what we promised the
> user. Nothing else.
