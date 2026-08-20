---
title: 'When to design for scale, and when it is just expensive guessing'
seoTitle: 'When to design for scale (and when not to)'
description: 'Designing for scale too early costs as much as designing for it too late. The signal I use to tell the two apart, learned from getting both wrong.'
published: 2024-12-01
updated: 2026-08-01
migrated: true
draft: false
topics: ['scope', 'craft']
hook: 'I have been burned from both sides: once by a design that could not grow, once by one built to grow into a market that never arrived.'
faqs:
  - q: 'When should you start building a design system?'
    a: 'When the same decision has been made twice, differently, and it caused a problem. Not before. A system is an answer to repetition, so if the repetition has not happened, you are maintaining an answer to a question nobody has asked, and the maintenance is real while the benefit is hypothetical.'
  - q: 'What does designing for scalability actually mean?'
    a: 'In practice it means two things: that a component can absorb a case you did not anticipate without being rebuilt, and that somebody who joins later can tell what the rules are. It does not mean anticipating every scenario. Nobody can do that, and trying produces complexity you pay for immediately against a benefit that may never arrive.'
  - q: 'How do you avoid over-engineering a design?'
    a: 'Ask what it costs to be wrong. If the design can be changed in an afternoon, guess and move. If changing it means a migration, a re-onboarding or a data change, that is a one-way door and it earns the extra thought. Most of the argument about over-engineering is really an argument about which of those two you are in.'
  - q: 'Is it better to design for scale too early or too late?'
    a: 'Too late, usually, but only because too late is visible and too early is not. A design that breaks under growth causes an obvious, fixable mess. A design built for growth that never came causes a slow tax on every change, and nobody ever files a bug for it.'
---
Every article about scalability tells you to plan for growth. Almost none of them mention that planning for growth has a price, that you pay it immediately, and that the benefit may never arrive.

I have been burned from both sides. That is the only reason I think I have anything useful to say here.

## Burn one: the design that could not grow

A few years ago I worked on a product for a small startup. It went well, which was the problem. As it grew, things that had been fine started falling apart — components that had been drawn slightly differently each time, states nobody had considered, a table that worked at ten rows and was unusable at four hundred.

None of it was dramatic. It was a slow accumulation of small inconsistencies, and unpicking it took roughly two months of work that produced nothing a user could see.

The lesson I took from that was: **think about what is next.** Which was right, and then I over-applied it for about a year.

## Burn two: the design that grew into a market that never arrived

The next project, I did it properly. Multi-currency in the data model. Components built for a permissions system we intended to have. Layouts that would survive a second language. A component library with variants for cases we had discussed but not shipped.

None of it was wasted in an obvious way — the code all worked. But every change after that had to be made three times, because everything was parameterised for cases that never showed up. We shipped slower for a year to serve an audience we never got.

**Nobody files a bug for this.** That is what makes it dangerous. A design that breaks under growth causes an obvious mess that somebody is assigned to fix. A design built for growth that never came causes a quiet tax on every single change, and it never gets attributed to the decision that caused it.

## The signal I use now

I stopped trying to predict and started watching for one thing — the same shift I ended up making with [measurement](/writing/heart-framework-vs-nps-user-experience/): **has this decision now been made twice, differently, and did it cause a problem?**

That is it. That is the whole test.

- Two people built a card component slightly differently and now the page looks wrong → build the component properly.
- Somebody asked for a second currency → do not build multi-currency. Find out whether it is one customer being polite or a pattern.
- The same layout problem has come up in three places → that is a pattern, and it earns a system.

A design system is an answer to repetition. If the repetition has not happened, you are maintaining an answer to a question nobody asked. I have written the same thing about [the smallest version](/glossary/#smallest-version) of a product and it is the same instinct: the cost is certain and immediate, the benefit is speculative and later.

## The exception that actually matters

There is one class of decision where you should think ahead even without the signal, and it is not the one people usually worry about.

It is not visual. It is **anything that becomes hard to change once real data exists.** How you model a user. Whether something belongs to a person or an account. What the URL structure is. Those are [one-way doors](/glossary/#one-way-door), changing them later means a migration, and migrations are where products go to lose a quarter.

Colours, spacing, component variants, layout: all reversible. Guess and move.

The distinction is not "big decisions versus small ones", it is **how expensive it is to be wrong**, and those are different questions. Plenty of decisions that feel enormous in the room are trivially reversible, and plenty that feel like details are not.

## What I would tell myself in 2024

The version of this essay I wrote two years ago ended with "think about how it could grow, you will be glad you did". That is half an idea.

The full one: **think about which parts you could not change later, and be honest that everything else is a guess.** Nobody can predict the future. What you can do is notice which decisions you would be unable to walk back, spend your thinking there, and let the rest stay cheap.

If you want a specific place to start, [the check on deciding now versus thinking longer](/tools/should-you-decide-now-or-think-longer/) is exactly this question asked in three parts, and it takes about forty seconds.
