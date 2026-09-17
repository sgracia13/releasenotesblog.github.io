# Blog setup

This is a Jekyll blog. GitHub builds it for you — there is nothing to install
and no build step to run.

## One-time setup

1. Create a repo named `yourusername.github.io` (your real GitHub username).
   Naming it this way puts the site at the root, so there's no subfolder path
   to configure.
2. Upload everything in this folder to the repo.
3. Open `_config.yml` and change `title`, `description`, and `author`.
4. Repo → **Settings** → **Pages** → Source → **Deploy from a branch** →
   `main` → `/ (root)` → Save.
5. Wait about a minute, then load `yourusername.github.io`.

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

- `style.scss` — a stylesheet that pushes the default theme toward
  neobrutalism. **Once you've posted a few times**, move it to
  `assets/css/style.scss` and it takes effect on the next commit. Don't do this
  first; find out whether you'll keep writing before spending time on how it
  looks.
- `blog-boilerplate.jsx` — a full React version of this blog styled with
  neobrutalism components. It needs a build pipeline, so it isn't wired up
  here. Keep it as a design reference and as the upgrade path if this becomes
  something you post to weekly and start wanting tag filters and file
  attachments. The posts are already plain Markdown, so migrating later is
  straightforward.
