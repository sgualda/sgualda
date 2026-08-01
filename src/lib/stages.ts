/**
 * The five stages of building a product.
 *
 * Names and one-line descriptions are verbatim from the Figma frame "Map".
 * The long-form copy is written in Sergio's voice, first person, with the
 * mistakes left in — that is the point of the page.
 *
 * `tools` cross-links each stage to the free checks that apply to it. That
 * mapping is real: each check was written for that moment.
 */
export type Stage = {
  slug: string;
  n: string;
  name: string;
  lead: string;
  /** Doubles as the section heading for the long-form copy. */
  question: string;
  x: number;
  y: number;
  tools: string[];
  body: string[];
  traps: string[];
  signal: string;
  /** The offer that fits this stage. No prices — Sergio cannot publish them. */
  cta: { title: string; body: string };
};

export const STAGES: Stage[] = [
  {
    slug: "worth-building",
    n: "01",
    name: "Worth building?",
    lead: "Before you build anything. Most of the cost is decided here.",
    question: "Is there a problem here worth anyone’s time?",
    x: 6,
    y: 72,
    tools: ["is-user-feedback-real-or-just-polite", "is-this-feature-worth-building"],
    body: [
      "Nobody skips this stage. They just do it badly — in their head, on a walk — and call the result conviction.",
      "I spent most of one summer building a tool for organising interview notes. I was sure about it. I had the problem myself, which felt like the strongest possible evidence, and I never checked whether anyone else did. Six people told me it sounded useful. Not one of them had ever done anything about the problem before I described it to them. That should have been the end of the conversation, and instead it was the beginning of three months.",
      "What I got wrong was the question. I was asking whether the idea was good, and everybody is polite about ideas. <strong>Now I ask whether anybody is already solving this badly, by hand.</strong> A spreadsheet somebody maintains on Sundays. A group chat with a naming convention nobody agreed to. A recurring reminder to check something manually.",
      "That ugly thing is the proof, and it is worth more than any amount of agreement. If nobody has built the ugly version, the pain is probably not there yet — which is not a verdict on the idea, only on the timing.",
    ],
    traps: [
      "Asking people whether they would use it. They will say yes, because saying no to somebody's idea is rude. Ask what they did the last time the problem happened instead.",
      "Counting your own excitement as demand. It is the least reliable signal available and the one you have the most of.",
      "Researching until it feels safe. It never will. Past a certain point you are collecting reassurance, not information.",
    ],
    signal: "You can name two people — actual people, not job titles — who already do this the hard way.",
    cta: {
      title: "A working session on whether to build it",
      body: "Bring the idea and whatever you have heard about it so far. We work out together whether there is a real problem underneath, and you leave with a decision rather than a maybe.",
    },
  },
  {
    slug: "first-version",
    n: "02",
    name: "First version",
    lead: "You know what to build. Now you decide how much of it.",
    question: "What is the smallest version that is still worth showing?",
    x: 28,
    y: 26,
    tools: ["should-you-decide-now-or-think-longer", "is-this-feature-worth-building"],
    body: [
      "Scope kills more products than competitors ever will, and it does it politely.",
      "Everyone agrees on building something small, right up to the moment somebody has to name the thing being cut. Then every item comes back with a reason attached, and the reasons are all good. That is the trap: <strong>you never lose an argument about scope. You accumulate small reasonable victories until the first version takes seven months.</strong>",
      "I have been the person making those arguments. On one project I fought to keep a settings screen nobody had asked for, because the flow felt incomplete without it. It cost about two weeks. When we finally launched, I checked: eleven people had opened it. I had defended it with the word <em>quality</em>, which is a word I have learned to distrust when it comes out of my own mouth in a scoping meeting.",
      "What works for me now is deciding what this version has to <em>prove</em>, in one sentence, before deciding what it contains. Everything that does not serve that sentence goes — not because it is bad, but because it is not this one. Most of it never comes back, which tells you what it was worth.",
      "And the deadline is not pressure. It is the most honest scoping tool you have, and the only one that does not negotiate.",
    ],
    traps: [
      "Building the version you would be proud to show instead of the version that answers the question.",
      "Polishing the part you enjoy. It is always the interface, and it is almost never the part that is actually at risk.",
      "Treating “we can add it later” as free. Later is where the entire roadmap already lives.",
    ],
    signal: "Somebody outside the team can use it without you narrating over their shoulder. Not admire it — use it.",
    cta: {
      title: "A working session on scope",
      body: "Bring the argument you are currently having. We settle what the first version has to prove and what comes out of it, and you get the reasoning in writing so your team can push back on it.",
    },
  },
  {
    slug: "nobody-came",
    n: "03",
    name: "Nobody came",
    lead: "You launched. Nothing happened. This is where I have lost the most.",
    question: "Which of the five reasons is behind a flat graph?",
    x: 50,
    y: 64,
    tools: ["why-is-nobody-using-your-product", "is-user-feedback-real-or-just-polite"],
    body: [
      "This is the stage that has cost me the most, and the reason is boring: <strong>five completely different problems look identical from here.</strong>",
      "Nobody saw it. They saw it and did not understand it. They understood it and did not need it. They needed it but moving to you was too much work. Or they tried it and it is not good enough yet. All five produce the same flat graph — and, worse, all five produce the same feeling.",
      "I got this wrong on a product I cared about. Signups were flat, so we assumed reach and spent a quarter on distribution. Traffic went up a lot. Activation did not move at all. We had been in the third one the whole time: people understood it perfectly and did not need it. The quarter was not wasted because we worked badly. It was wasted because we never stopped to ask which problem we had.",
      "The fixes point in opposite directions, which is what makes guessing expensive. More traffic only helps the first one. A better product only helps the last one. So the real mistake is not picking wrong — it is <strong>acting quickly without picking at all</strong>, which in practice means doing marketing, because marketing feels the most like doing something.",
      "The diagnosis is cheap. An afternoon and nine honest conversations about the last time the problem happened, without mentioning your product. I wish I had spent that afternoon before spending the quarter.",
    ],
    traps: [
      "Reading the silence as rejection. It usually is not. Rejection would require them to have understood you first.",
      "Adding features to fix something that has nothing to do with features.",
      "Asking your existing users why other people are not using it. They are the least qualified people in the world to answer that.",
    ],
    signal: "You can say which of the five you are in, and say out loud why the other four are not it.",
    cta: {
      title: "A product review",
      body: "Five days on the product, your numbers, and up to nine conversations with your actual users. You get a ranked answer on which of the five you are in, with the reasoning attached so your team can argue with it.",
    },
  },
  {
    slug: "make-it-repeatable",
    n: "04",
    name: "Make it repeatable",
    lead: "It works. Now do it again, with other people.",
    question: "Why does the same work keep coming back?",
    x: 72,
    y: 24,
    tools: ["why-your-team-keeps-redoing-the-same-work", "should-you-decide-now-or-think-longer"],
    body: [
      "Doing something once is a story. Doing it again, with different people, is a business — and it is a completely different skill. I was much better at the first one for a long time.",
      "What breaks here is never the product. It is that every important decision lives inside somebody's head, usually the person who was there at the start. Nothing got written down because everyone was in the room. Then the room changes, and the same argument comes back every few weeks with slightly different people in it.",
      "For about a year I was that person. I knew why every component looked the way it did, and I mistook that for the system being in good shape. It was not a system, it was me. The month I was away, three people made three reasonable and mutually incompatible decisions, and none of them did anything wrong — there was simply nothing to consult.",
      "The fix is unglamorous and takes ten minutes a week. <strong>Write down what was decided, why, what you rejected, and what would make you change your mind.</strong> Four lines. It ends an entire category of argument and it is worth more than any process anyone will propose instead.",
      "Be careful here, because this is the stage where teams reach for ceremony. Messy and broken are different things, and process only improves one of them.",
    ],
    traps: [
      "Adding process because things feel chaotic. Feeling chaotic and being broken are not the same measurement.",
      "Hiring to solve a decision problem. You get more opinions in the room and the same unclear owner.",
      "Assuming what worked at five people works at fifteen. In my experience it starts creaking at about eight.",
    ],
    signal: "Something shipped well while you were not paying attention to it.",
    cta: {
      title: "Time inside the team",
      body: "A few months in your tools, your standups and your arguments — deciding with you rather than for you, and leaving behind a written decision log that still works after I am gone.",
    },
  },
  {
    slug: "charging-for-it",
    n: "05",
    name: "Charging for it",
    lead: "Someone has to pay. This is the part I am weakest at.",
    question: "Can you put a price on it yet?",
    x: 94,
    y: 70,
    tools: ["can-you-charge-for-your-product-yet", "is-user-feedback-real-or-just-polite"],
    body: [
      "I will be honest: this is the part I am weakest at, and I think it is common among designers. We are comfortable talking about value right up until it has a number attached to it.",
      "The first time I put a price on something of my own, I picked the number by looking at what other people charged and going slightly under. Nobody bought it. Then somebody wrote to ask whether there was a version with support, and offered roughly three times what I was asking. I had not been too expensive. I had been describing the wrong thing, cheaply.",
      "What I have learned since is that the signal you are waiting for is simpler than the one you are looking for. It is not a survey and it is not a competitor's pricing page. It is <strong>whether anybody has asked what it costs before you brought it up.</strong> That question is a person telling you they have already decided.",
      "The other thing worth knowing: a price is far easier to change than to introduce. Waiting until the number feels right is a way of not deciding, and free users teach you almost nothing about what somebody will pay for. The first number will be wrong. Pick it anyway, tell your existing users before it goes public, and watch who leaves.",
      "If nobody leaves, you were too cheap. That is information, not a failure — and it took me an embarrassingly long time to hear it that way.",
    ],
    traps: [
      "Building a pricing page before a single person has asked the price.",
      "Tiers. They are usually a sign of not being sure what you are selling, and people read that uncertainty accurately.",
      "Discounting to close the first customer. You learn nothing about what it is worth and you have set the anchor.",
    ],
    signal: "Somebody asked how much it costs before you told them.",
    cta: {
      title: "A working session on pricing",
      body: "Bring what you know about who pays for what today. We pick a number, decide what would make you change it, and write down how you will tell the people already using it.",
    },
  },
];

export const stageBySlug = (slug: string) => STAGES.find((s) => s.slug === slug);
