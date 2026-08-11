---
layout: post.njk
tags: post
title: "elbow Got Rejected. Here's Exactly Why."
subtitle: "I had a feeling it wouldn't pass on the first try. Three small, avoidable mistakes — and what I'm doing differently on round two."
date: 2026-08-11
dateDisplay: "11 August 2026"
---
I said, at the end of the last post, that I doubted [elbow](https://www.elbow-app.com) would get through App Store review on the first try. That wasn't false modesty — it was a genuine feeling, the kind you get when you know you moved a bit too fast at the end. I was right. It got rejected.

Not for one thing. For three. All small, all completely avoidable in hindsight, and all worth writing down properly — the reel version only had room for the headline.

## What actually happened

I'd requested an expedited review a few days earlier, mostly out of impatience, and mostly assuming it wouldn't do much. It did — the verdict came back fast. Just not the verdict I wanted. Three separate issues, all flagged at once.

### Mistake one: I only submitted the app

I'd assumed the app record was the whole submission. It isn't — if you have in-app purchases or subscriptions, those are separate elements that need to be added and submitted alongside the app itself. I hadn't done that. So as far as Apple's review was concerned, I'd shipped an app with a paywall that led nowhere, because the thing behind the paywall was never actually part of the package.

Obvious once you know it. Not obvious the first time you're doing it — except I'd already done it correctly once before. [Life in the UK: Flashcards](https://lifeintheukflashcards.com/) has essentially the same setup — an app record plus separate purchase elements — and I got that right the first time round. I should have known better on elbow than to assume the app record alone would cover it.

### Mistake two: a price that wasn't actually on Apple's list

This one wasn't carelessness — I'd actually looked at what comparable apps charge before picking a number. A quick scan of other cleaning-schedule apps shows monthly subscriptions landing anywhere from under a pound to around four or five, with a fair few sitting right in the two-to-three range. £2.49 was a deliberate choice, aimed at that middle-of-market spot rather than pulled out of thin air.

The mistake was technical, not strategic: I hardcoded that number into the app without checking it against Apple's actual price list first. App Store Connect doesn't let you type in an arbitrary price — you pick from a fixed set of Apple-approved price points, and 2.49 simply isn't one of them. The closest option above it is 2.99. So the number I'd researched and built the paywall around didn't exist as a sellable tier, and the fix wasn't "pick a different price," it was "pick the nearest real one."

### Mistake three: an iPad I never meant to ship

Somewhere in the Xcode project settings, the destination for the app included iPad, not just iPhone. I never tested it on iPad, never designed a layout for it, and never intended to support it — elbow is a phone app, full stop. But Apple doesn't know "never intended to" — it just sees a submission claiming iPad support with none of the required iPad screenshots or landscape handling, and flags it accordingly.

## Fixing it

Once you know what's wrong, none of this is hard. I removed the iPad destination entirely and pulled the iPad screenshots I'd added, since there's no reason to fight landscape support for a device I never meant to target. And I resubmitted properly this time — the app, the lifetime purchase, and the monthly and yearly subscriptions, all as their own elements, all together.

The price was the fiddly one, though, precisely because it was hardcoded — baked directly into the app's compiled code rather than something I could just tweak as a setting in App Store Connect. Changing it meant going back into the source, editing the actual value, and creating a new build: a fresh compiled version of the app, made from the updated code. That new build then has to be uploaded and attached to the submission before you resubmit — you can't fix a hardcoded value after the fact the way you can flip a toggle. So "change one number" turned into "recompile and re-upload the whole app," which is a good reminder not to hardcode anything you might need to change in a hurry.

The expedited review did what it promised, for what it's worth: it got me a fast answer. It just happened to be a fast *no*. I'd take that trade again — a quick, specific rejection beats a slow, vague one every time, because at least you know exactly what to fix.

## Where this leaves things

Back in the review queue. Technically square one — same app, same starting line. But this round I'm considerably more optimistic than the last one, mostly because "optimistic" this time is based on actually knowing what was wrong, rather than just hoping nothing was.

The runway's still counting down in the background, same as ever, so this isn't a huge deal either way — a rejected submission costs a review cycle, not the whole plan. But I'd rather it clear on the second try than the third.

Next update: whether round two actually goes through. Fingers crossed, genuinely this time.
