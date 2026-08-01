# Voice

> How this site sounds, written down, so the next page sounds like the last one.
>
> Everything here is descriptive before it is prescriptive: the rules were read
> off the copy that already exists and that Sergio approved, then tightened
> where the site contradicted itself. Where a rule and a good sentence disagree,
> the sentence wins — but change the rule too, in the same commit.
>
> Last updated 2026-08-01.

---

## The filter

Before the tone, the test that decides whether a sentence belongs here at all:

> **If it cost me nothing, then I read it somewhere and I am repeating it.**

That line is on the home page and it is the whole editorial policy. Every claim
on this site should be traceable to something that happened, and preferably to
something that went badly. Advice with no scar tissue is available everywhere
for free, which is exactly what it is worth.

Practical consequence: **write from the incident, not from the principle.** Not
"validate early" but "we spent six weeks on a feature two people asked for and
nobody used". The principle is the reader's job to extract.

---

## Five principles

**1 · Specific beats emphatic.**
The site never raises its voice. It gets its force from precision — numbers,
counts, named consequences. *"Twelve components across four teams instead of the
forty that were planned"* lands harder than "a dramatic simplification", and it
is checkable.

**2 · Say the cost.**
Every recommendation carries what it costs to follow it, and every case study
carries what the work cost to get wrong. A page that only lists upside reads as
a pitch, and the reader discounts all of it.

**3 · Decline in the first paragraph.**
*"I would rather lose the project in a paragraph than in month two."* When the
answer is no, the site says no early, in plain terms, and explains the
reasoning. It never softens a refusal into a maybe.

**4 · No inherited vocabulary.**
Words are used with a specific meaning or not used at all. The ones that carry
weight here are defined on `/glossary/` — *workaround*, *repeat use*, *polite
no*, *reversible decision*, *switching cost*. Anything that sounds like it came
from a conference talk should be replaced with what actually happened.

**5 · Light, not cute.**
The tone is relaxed, not jokey. Dryness is allowed and welcome; a punchline at
the end of a serious paragraph is not. The reader is a founder at 11pm with a
product that is not working — they will forgive bluntness and resent whimsy.

---

## We say / we don't say

| We say | We don't say |
|---|---|
| what it cost | lessons learned, key takeaways |
| a first version | an MVP (unless the essay is about the term) |
| somebody used it twice, on their own | validated, product-market fit |
| I would not take this on | this may not be the right fit at this time |
| nine conversations with your users | user research |
| the smallest version that answers the question | a lean approach |
| I got this wrong and here is what it cost | in retrospect, there were learnings |
| a straight answer within a day | we will get back to you shortly |
| free, no account, no email | sign up to unlock |
| I am very good at sounding certain | I bring deep expertise |

Two harder ones:

- **Never "we"** when it means one person. This site is one person and the whole
  proposition depends on that being obvious. "We" is for the client and Sergio
  together during an engagement (*"we would both know by week two"*), never as a
  corporate plural.
- **Never a second-person accusation.** *"You have already decided and you want
  it validated"* works because it is a heading in a list the reader chose to
  read. The same sentence in the middle of a paragraph reads as a scolding.

---

## Contractions — the rule

The site was inconsistent here: roughly 40% of contractable phrases were written
out in full, and the split ran along a page boundary rather than a meaning
boundary. `/about/` said *"I've"*, *"wasn't"*, *"doesn't"*; `/work-with-me/` said
*"I am"*, *"do not"*, *"cannot"* — two different people, three clicks apart.

**The rule, in one line: contract everything except a negation.**

**Contract.** `I’m`, `I’ve`, `I’ll`, `it’s`, `that’s`, `you’re`, `there’s`,
`here’s`, `we’re`, `they’re`. This is the register the site wants, and it is
what a reader expects from a person writing in their own name.

**Never contract a negation.** `do not`, `does not`, `is not`, `cannot`,
`will not`, `did not` — always in full:

> **I will not do it.**
> **Do not hire me if…**
> The number **does not** move depending on how well funded you look.
> A dashboard **is not** a screen.

The reason is rhythm, not grammar. Uncontracted negation is slower and flatter,
and almost every negation on this site is a line being drawn — a refusal, a
boundary, a definition by exclusion. `don’t` makes those sound like a shrug.
The contracted forms had survived only in the five essays migrated from
WordPress, which is exactly why the site read as two people.

**One exception, and it is mechanical.** Do not contract when the verb ends the
clause: *"find out what it is, not to defend what I made"*, *"how hard it is to
undo"*, *"tell me where you are"*. `what it’s,` is not English.

**Test:** if the sentence contains "not", write it out. Otherwise contract it.

---

## Punctuation

**Em dash — with spaces around it.** The site uses 228 of them and zero en
dashes. They join a clause to its consequence, which is the site's most
characteristic move: *"Advice that has to travel through two people arrives as
an opinion — and opinions lose to whoever is most tired."* Two per paragraph is
already too many.

**Curly apostrophes and quotes** (`’` `“` `”`), never straight ones. Markdown
files get this automatically; `.astro` and `.yaml` files do not, so type the
character.

**No exclamation marks.** There are exactly two on the whole site: one quoting a
product's own UI copy, and one in a migrated WordPress essay that should be
rewritten. Neither is a precedent.

**Question marks are fine and there are 168 of them.** The checks are literally
questions. A rhetorical question in body copy is not the same thing and is
usually a sign the sentence is avoiding a claim.

**Sentence case everywhere** — headings, buttons, labels, nav. Never Title Case.

**Headings end in a full stop when they are statements** (*"Making things is no
longer the hard part."*) and in a question mark when they are questions. A
heading that is a two- or three-word label (*"Site"*, *"More"*, *"Questions"*)
takes nothing.

**Line breaks in headings are deliberate.** Display headings use an explicit
`<br />` to control the turn, because balanced wrapping picked worse breaks. The
break should fall at a grammatical joint, never between an adjective and its
noun.

---

## Spelling and numbers

**British spelling.** `recognise`, `behaviour`, `organised`, `prioritise`,
`colour`. Two `realize`s survive in a migrated essay and are the exception, not
the standard. Keep the vocabulary international even so: *lift* and *rubbish*
are British in a way that costs a non-native reader a beat, so avoid them.
Simple, neutral, international English — a fluent second-language reader should
never have to reread a sentence.

**Numbers are spelled out up to twelve** when they are a count of things
(*"nine conversations"*, *"five days"*, *"twelve components"*). Digits for
measurements, money, dates, versions, percentages and anything above twelve
(*"40 seconds"*, *"forty reasonable ones"* is the deliberate exception where the
number is rhetorical rather than counted).

**Round numbers are suspicious.** *"about a third of what lands in my inbox"* is
honest; "90% of founders" is a number nobody measured. If the figure was not
counted, say roughly, usually, or about.

---

## Ten before / after

Real edits, from this site.

| Before | After |
|---|---|
| My journal · Stories, thoughts and reflections | What I got wrong, and what it cost |
| A curated selection of my best work | Some of my projects are buried, in public |
| I'm passionate about user-centred design | Anyone can produce a screen. Almost nobody can say why that one and not another |
| Let's build things that matter and enjoy the ride | *(cut — it is a sentiment, not a claim)* |
| We deliver actionable insights | A short ranked document: the five things that matter, in the order to do them |
| Get in touch and let's chat | It starts with a written brief rather than a call |
| Pricing available on request | I am not publishing prices at the moment. Send a brief and you will have a specific figure within a day |
| This may not be the right fit | Then you do not want a product designer, you want an alibi |
| I leverage data to drive decisions | The only signal that means anything is somebody using the thing a second time, on their own |
| Only time will tell, but I'm optimistic about its potential! | *(rewrite — the exclamation mark and the hedge are both doing the same evasive job)* |

---

## Before publishing

Six questions. Any "no" is a rewrite, not a note for later.

1. Could this paragraph appear on any other product designer's site? *(If yes,
   cut it or make it specific.)*
2. Is every claim traceable to something that happened?
3. Does it say what the advice costs to follow?
4. Are the contractions consistent with the rule above — casual contracted,
   refusals full?
5. Sentence case, curly apostrophes, no exclamation marks, em dashes spaced?
6. Would a fluent second-language reader get through it without rereading a
   sentence?

---

## Where this is enforced

- `npm run audit:urls` — structural, not editorial. It will not catch tone.
- Keystatic (`CMS=1 npm run dev`, then `/keystatic/`) shows the character limits
  for meta descriptions, which is the only copy rule the build enforces.
- Everything else on this page is enforced by reading it before committing.
  That is a weaker mechanism than a test, which is why the list above is six
  items and not twenty.
