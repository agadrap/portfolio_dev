---
layout: post.njk
tags: post
title: "I Got Annoyed at an Audiobook and Built Earbind"
subtitle: "Two weekends from a Dropbox file I couldn't navigate to a live product with a real author using it."
date: 2026-09-15
dateDisplay: "15 September 2026"
---
A few weeks ago I was listening to an audiobook. Not from Audible — the author had sent it to me directly, as a file in a Dropbox folder.

It was three and a half hours in one piece. No chapters. No way to tell where anything was. I ended up listening to the whole thing in a single sitting, because stopping meant losing my place entirely, and pausing to write something down meant scrubbing back and forth trying to find where I'd been. At one point I tapped the wrong bit of the progress bar and lost my spot completely.

The book was good. The experience of listening to it was miserable, and none of that was the author's fault — she'd done the hard part. She'd just been handed the only distribution option that doesn't involve giving half the money and all of the customers to a platform.

That felt like a thing that shouldn't be true. So I built [Earbind](https://earbind.com).

## What it is

You give it your audiobook. It gives you back a web page: the audio, the full transcript, real chapters, and a search box. Type a phrase, land on the sentence, and the audio jumps to that exact word.

The transcript is the bit that matters. Nobody listens to a business book front to back — they go looking for the part about pricing, or the part about referrals, and right now finding that in an audiobook is essentially impossible. On a page, it takes three seconds.

It's a link. No app, no account, nothing for the reader to install or sign up to.

## Two weekends

I built a rough version over a weekend and sent it to the author, mostly to find out whether the idea was as obvious as it felt. She liked it. That was enough of a signal — I bought the domain and spent the next weekend building the real thing.

It's live now, she has her copy, and there's a waitlist open for anyone else with an audiobook.

## How it's built, and why that matters

Python does the heavy lifting: ffmpeg for the audio, Whisper running **locally on my own machine** for the transcript — for now, at least; automating that end of it properly is the next job. The audio never goes to a transcription service, which isn't really a technical decision so much as a promise I can actually keep: an author's unreleased book is not something to hand to a third party.

The output is a self-contained HTML page. That sits in a private Cloudflare bucket and is served by one small edge function.

No framework. No database. No server.

That's not a purity thing. It means there's no infrastructure that grows teeth as customers arrive, and nothing sitting in the background quietly needing to be patched — which matters a lot when the entire operations team is me. It also means I can charge a yearly fee that undercuts the nearest comparable tools rather than having to match them.

## The bug that only existed in one place

My favourite problem from the build, in a grim way.

At one point the audio stopped playing entirely. Everything I used to check it said the server was fine. `curl` returned exactly the right response. Fetching the same file from JavaScript returned exactly the right response. The browser console was clean — no errors, no warnings, no security violations. By every available measurement, it worked.

It was completely broken.

The cause: when a browser plays audio it asks for small byte ranges, and it was also asking "has this changed since last time?" My server was answering "no, your copy is fine" — which is a perfectly correct answer to that question, and a dead end for an audio player, which had asked for bytes and got told to use a cache it didn't have. It just sat there loading forever, with no error, because from its point of view nothing had gone wrong yet.

Every tool I had said healthy. Only an actual `<audio>` element cared.

The lesson I keep relearning: **when the tests pass and the thing is visibly broken, suspect the tests.** I spent far too long assuming the browser was lying.

Also, at one point I broke the play button while building the author's editing view. The play button. On an audiobook player. Only the single most important function in the entire product.

## Where it is now

Earbind is live at [earbind.com](https://earbind.com). One author is using it. Early access is open at $79 a year for the first group, going to $149 after that.

If you've got an audiobook sitting in a folder somewhere, that's exactly who this is for.

Next - we find out if anyone else thinks so.
