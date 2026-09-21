---
title: "earbind"
tagline: "An audiobook, as a page instead of a file. Audio, full transcript, real chapters, and a search that jumps to the exact word — no app, no account, nothing to install."
description: "earbind — turns an audiobook into a hosted page with audio, transcript, real chapters, and word-level search. Transcribed locally, served from the edge."
status: "live"
prompt: "$ ./earbind --listen"
schemaType: "WebSite"
websiteUrl: "https://earbind.com"
tags: ["python", "whisper", "ffmpeg", "cloudflare workers", "r2", "no framework"]
links:
  - label: "earbind.com →"
    href: "https://earbind.com"
    primary: true
  - label: "join the waitlist →"
    href: "https://earbind.com/#waitlist"
---

## What it is

An audiobook, as a page instead of a file. The reader gets the audio, the full transcript, real chapters, and a search box that jumps to the exact word — no app, no account, nothing to install. The author gets a private editor to fix whatever the transcription misheard, and publishes when they are happy.

## Why it exists

Built because an author sent me her book as a three-and-a-half-hour Dropbox file with no chapters, and I kept losing my place. Transcription runs locally — an unreleased book never goes to a third-party service. The output is a static page in a private bucket behind one edge function — no framework, no database, nothing to keep running.

## Where it's written about

- [I Got Annoyed at an Audiobook and Built Earbind](/blog/earbind-from-annoyance-to-live-product/)
