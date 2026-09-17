---
layout: post
title: "The spec is not the product"
tags: [specs, process]
---

The first spec I ever wrote was forty pages long. It had a glossary. It had an
appendix explaining the glossary. Three engineers opened it, two of them
scrolled to the wireframes, and the one who actually read it found a
contradiction on page 31 that I'd introduced on page 12.

I took that as a sign I needed a better template. It was actually a sign I
needed a shorter document.

## What a spec is for

A spec exists to surface disagreement early, while disagreement is still cheap.
That's the whole job. Every section that doesn't help someone say "wait, no" is
padding.

> If nobody argued with your spec, it wasn't specific enough to be wrong.

The rewrite that finally worked was four sections: what breaks today, what we're
changing, what we're deliberately not changing, and how we'll know it worked.

## The not-changing section earns its keep

Half of scope creep is people assuming an adjacent thing is included. Writing
down what you're not touching costs four bullets and saves a sprint:

- Not touching the legacy import path — it stays on v1 until Q1.
- Not adding bulk actions. Single-item flow only for this release.
- Not changing permissions. Same roles, same rules.
- Not localising the new strings yet. English ships first.

## Write the success check before the build

If you can't name the query you'd run to tell whether this worked, you don't
have a spec, you have a wish. I now paste the actual query in:

```sql
select
  date_trunc('week', started_at) as week,
  count(*) filter (where status = 'complete') * 1.0 / count(*) as completion_rate
from upload_sessions
where started_at > '2026-09-01'
group by 1
order by 1;
```

Two things happen when you do this. Engineers tell you the event you need
doesn't exist yet, which is a much better thing to learn now. And you find out
whether you actually care about the answer.
