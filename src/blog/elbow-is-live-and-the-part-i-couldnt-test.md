---
layout: post.njk
tags: post
title: "elbow Is Live. Then the Part I Couldn't Test Broke."
subtitle: "Round two went through. Then the paid feature failed in the wild — and it turned out to be the one thing a simulator can't check."
date: 2026-09-14
dateDisplay: "14 September 2026"
---
Last time I wrote here, [elbow](https://elbow-app.com) had just been rejected for three small things, and I said I'd be back with whether round two went through.

It did. elbow is on the [App Store](https://apps.apple.com/gb/app/elbow/id6796699431).

That's the good bit, and it's genuinely a good bit. But it isn't the interesting part of the last few weeks, because getting approved turned out to be the easy half.

## The feature I couldn't test

elbow has household sharing on the paid tier: you share your cleaning setup with whoever else lives in your house, so you're not both scrubbing the same bathroom on a Tuesday. It's the main reason to pay.

It didn't work.

Not "worked with a bug" — it just didn't. And here's the thing I hadn't properly reckoned with: **I couldn't test it on my own.** Household sharing needs two real devices with two different real Apple IDs. The Xcode simulator can't do it. My own phone can't do it, because sharing with yourself isn't sharing. So the one feature that justifies the subscription is the one feature I had no way to check before shipping, and I shipped it anyway because everything else worked.

I borrowed a second phone. Then I was debugging across two devices, one of which wasn't with me at all times — applying a fix, pushing a build, waiting for someone to get home and tell me what happened. Three different fixes went out that way. Each one felt like the one.

## What it actually was

I tested the third fix. It didn't work either — so I left it for the weekend and came back to it on the Monday, which turned out to be the most useful thing I did all week. I woke up with actual ideas about what was wrong, which I definitely would not have had at 9pm on the Friday staring at the same screen.

The app was reading the wrong setup — not a broken sharing implementation, but the wrong environment underneath it, so the invitation was being made in one place and looked for in another. Once I could see that, the fix was small.

Two things helped more than the code did. One: I'd built a diagnostics view inside the app, which let me confirm what version and configuration each phone was actually running instead of assuming. When you're debugging something that only reproduces on hardware you're not holding, "what is that device *actually* doing" is most of the battle. Two: stepping away from it.

I reset it, re-shared the link, and it worked. On two phones, both real, both with their own accounts. I was chuffed.

## What I'm taking from it

**The features you can't easily test are the ones that break.** Obvious written down. Much less obvious when you're a week from shipping and everything you *can* test is passing — the untestable thing quietly becomes the thing you assume is fine, precisely because you can't prove it isn't.

**A friend's fresh eyes are worth more than another hour of my own.** Somewhere in the middle of all this, a friend downloaded elbow and did a proper UX pass — a long list of places where something wasn't obvious, or didn't behave the way she expected. Honestly, gold. None of it was what I'd have looked at myself, because I've used this app for months and I've stopped being able to see it. That list is what I'll work on next for elbow.

**Build the diagnostics before you need them.** I added that view almost as an afterthought. It's the thing that eventually told me what was wrong.

## Where it is now

elbow is live, household sharing works, and it's now available in the EU as well. That last one was its own small saga: Apple requires a verified trader status to sell into the EU, and mine was stuck because the addresses on my developer account didn't match each other exactly. It took raising a ticket and getting them aligned before it cleared — no code involved, just paperwork that quietly blocks an entire market until it's right.

Next up are the UX notes — the small "why doesn't this do what I expect" things that don't break anything but make the difference between an app someone keeps and one they delete.

elbow is on the [App Store](https://apps.apple.com/gb/app/elbow/id6796699431), and there's more about it at [elbow-app.com](https://elbow-app.com).

And there's a new project, which started because I got annoyed listening to an audiobook. More on that in the next post.
