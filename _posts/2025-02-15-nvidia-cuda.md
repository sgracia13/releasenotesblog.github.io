---
layout: post
title: "NVIDIA's Compute Unified Device Architecture (CUDA)"
tags: [hardware, ai]
---

If Ford was the best car manufacturer in the world, then NVIDIA is the best AI hardware manufacturer in the world. They produce something called a Graphics Processing Unit (GPU) that gives your computer the ability to run a huge number of math problems at the same time instead of one after another. That's what makes modern AI possible. That's the extremely simple version.

The GPU is an actual piece of hardware: it's physical. So think of it as an extra lego block in your set. You might also hear the term graphics card get thrown around. Depending on your needs, you might buy the graphics card, which comes with a GPU built on it (the graphics card is a board) along with fans, video memory and display ports.

We know now that a GPU is very important for AI. So what the hell is the Compute Unified Device Architecture (CUDA)? Well, the people who write code need a way to communicate with the GPU. The GPU doesn't magically show up at your door or your company's front steps and know what you want to accomplish. It's still hardware, and like a good dog or pet, you have to tell it what you want it to do.

CUDA is how you tell it. It's the translator that sits between the code a person writes and the chip that does the work.

Here's the part most people get wrong. When you picture someone building AI, you probably picture them typing in Python, and that's true. But Python isn't what the GPU understands. Python goes to a toolkit, the toolkit goes to CUDA, and CUDA is what actually speaks to the chip. It's less like a phone call and more like a relay. Each layer hands off to the next one, and CUDA is the last hop before the hardware.

NVIDIA's real advantage is that for almost twenty years, everything built for AI has been built on top of CUDA. Other companies have their own versions and they're getting better, but they're playing catch up on two decades of work. So when someone says "we'll just switch to a cheaper chip," the chip was never the hard part. The twenty years of stuff built on top of it is the hard part.

That's why NVIDIA is worth what it's worth.

So that's cool and all, but what does it matter? Shouldn't we, in the year 2026, have all of this stuff happening for us already? Aren't we smart enough to just put this bad boy on autopilot and build more GPUs? If we need more compute power we just build more, right?

A lot of it is automated now, and that's real. But somebody has to build the automation, and the gains from doing it well are enormous. There's a famous example where researchers sped up a core piece of AI by several times without changing the math at all. They just changed the order things moved around inside the chip. Same hardware, same answer, a fraction of the time. It was pure choreography.

Understanding the hardware buys you better use of the one sitting in the rack already. (Remember all these GPUs are hardware sitting inside of warehouses somewhere).
