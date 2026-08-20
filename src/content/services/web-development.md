---
title: 'Web development'
heading: 'Web development'
seoTitle: 'Web development — fast, static, accessible sites'
description: 'Building the site: static output, real HTML, no framework you will be stuck maintaining. Handed over as a repository your team can keep working in.'
intent: 'web developer to build a fast static site'
lead: 'Turning a design into a site that loads immediately, works without JavaScript, and can be handed to somebody else without a briefing.'
order: 2
forWho:
  - 'A team with a design — mine or somebody else’s — and nobody free to build it.'
  - 'Anybody on a WordPress install that has become four plugins holding hands, where every change is a small negotiation.'
  - 'A founder who wants to be able to publish without asking a developer, and does not want a database to do it.'
notFor:
  - 'Applications. Anything with accounts, payments, a dashboard or per-user state is a product build with a team behind it, and one freelance developer is the wrong shape for it.'
  - 'Rescuing a codebase I did not write, on a stack I do not use. I will look and tell you what I think, but taking ownership of somebody else’s half-finished app is how both of us have a bad quarter.'
  - 'Anybody who needs a specific CMS because the company already pays for it. I will work with what you have where I can, but if the requirement is the tool rather than the outcome, you want a specialist in that tool.'
howIWork:
  - name: 'Agree what "done" is before writing anything'
    body: 'A written list of every URL the site will have, what each one is for, and what has to be true before it ships — speed, accessibility, what happens to the old addresses. It goes in the repository and the build checks it. Scope arguments happen against a document rather than a memory.'
  - name: 'Build the hardest page first'
    body: 'Not the easiest. The page with the awkward layout, the long content, the thing nobody has thought through. If it is going to be a problem, it is a problem in week one when there is room to change the plan.'
  - name: 'Content out of the code'
    body: 'Pages are code; words are markdown. You get an editor that runs on your own machine, with no account and no monthly fee, and every change it makes is an ordinary file you can read. If I disappear, nothing about publishing stops working.'
  - name: 'Hand it over so it stays handed over'
    body: 'A repository with a README somebody else can follow, automated checks that fail loudly on a broken link or a missing page, and a deploy that is one command. The measure is whether your developer can ship a change in month six without calling me.'
deliverables:
  - 'A repository you own, with the history, not a zip file.'
  - 'Static output: real HTML on disk, so it is fast and readable by crawlers that do not run JavaScript.'
  - 'Redirects for every old URL, written down and verified at build time.'
  - 'Accessibility and performance checks that run on every push, so a regression fails the build instead of being discovered later.'
  - 'A README that assumes the reader is not me.'
faqs:
  - q: 'What do you build with?'
    a: 'Astro, static output, as little JavaScript as the page can get away with — usually none. It produces real HTML files, which is what makes a site fast, what makes it survive a decade, and what makes it readable to search crawlers and language models that never run scripts. If your team already lives in a different stack and wants to keep maintaining it, say so early and I will tell you honestly whether I am the right person.'
  - q: 'Can we edit the site ourselves?'
    a: 'Yes. Content lives in markdown files with a visual editor on top of them, running locally, with no account and no subscription. It is genuinely simpler than WordPress for writing, and it has one honest downside: publishing means the site rebuilds, which takes a minute or two rather than being instant. For a site that publishes a few times a week that is a fair trade, and I will say so if it is not.'
  - q: 'What about hosting?'
    a: 'A static site runs anywhere and costs almost nothing to serve. I will deploy to whatever you already pay for if it can serve files, and recommend something if you have nothing. There is no vendor here you have to keep paying to keep the site alive.'
  - q: 'Will our search rankings survive a rebuild?'
    a: 'They survive if the old addresses keep working, which is the part most rebuilds get wrong. Before anything is built I take an inventory of every URL that currently exists and every one that is indexed, and each of them either stays exactly where it is or redirects somewhere sensible. The build then fails if a promised URL is missing, so it cannot quietly break later.'
intake:
  - ['s1', 'Is there a design already?', 'select|Yes, finished|Yes, in progress|No — I need that too', '']
  - ['s2', 'What is it running on now?', 'input', 'WordPress, Webflow, Squarespace, custom, nothing yet.']
  - ['s3', 'Does anyone need to edit content without a developer?', 'select|Yes, often|Occasionally|No', '']
  - ['s4', 'Anything it has to connect to?', 'textarea', 'Forms, a CRM, analytics, a booking tool, a payment provider.']
  - ['s5', 'Anything technically unusual about it?', 'textarea', 'Several languages, a members area, a large existing site, a hard deadline.']
---
