## Publishing a post

Add a file to `_posts/` named `YYYY-MM-DD-some-slug.md`:

```markdown
---
layout: post
title: "Your title here"
tags: [planning, data]
---

Write in Markdown. Headings, lists, quotes and code blocks all work.
```

Commit it. The post appears within a minute or two.

**The date prefix in the filename is required.** Jekyll uses it to order the
feed, and a post with a malformed or future-dated filename silently doesn't
appear. This is the single most common reason a post doesn't show up.

## Tips

- Press `.` in any GitHub repo to open a full VS Code editor in the browser,
  with live Markdown preview. Much better than the plain file editor for
  anything longer than a paragraph.
- Images go in an `images/` folder at the root; reference them as
  `/images/thing.png`.
- Drafts go in a `_drafts/` folder with no date in the filename. They won't be
  published.

## What's in `_reference/`

Nothing in this folder is published — `_config.yml` excludes it.

The neobrutalist stylesheet used to live here. It now lives at
`assets/main.scss`, which is the only filename the `minima` theme actually
loads. If you move it anywhere else (`assets/css/style.scss`, for example)
Jekyll still compiles it, but no page links to it and the site silently renders
with the stock theme.

- `blog-boilerplate.jsx` — a full React version of this blog styled with
  neobrutalism components. It needs a build pipeline, so it isn't wired up
  here. Keep it as a design reference and as the upgrade path if this becomes
  something you post to weekly and start wanting tag filters and file
  attachments. The posts are already plain Markdown, so migrating later is
  straightforward.
