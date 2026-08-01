/**
 * The six free tools.
 *
 * Extracted verbatim from the approved prototype generator so the copy is
 * character-for-character what Sergio signed off on.
 */

export type Bucket = { max: number; name: string; sub: string; body: string; next: string[] };
export type Tool = {
  id: string; cat: string; slug: string; n: string;
  time: string; count: string; title: string; meta: string;
  lead: string; out: string;
  answers: [string, string][];
  faqs: [string, string][];
  q: [string, [string, number][]][];
  b: Bucket[];
};

export const CATS: Record<string, string> = {growth: 'Launch & growth', users: 'Users & feedback', decisions: 'Decisions', team: 'Team & process' };

export const TOOLS: Tool[] = [{ id:'why', cat:'growth', slug:'why-is-nobody-using-your-product',
  n:'Why is nobody using your product?',
  time:'40 seconds', count:'3 questions',
  title:'Why Is Nobody Using Your Product? — Free 40-Second Check',
  meta:'Answer three questions about your launch and find out which of five reasons is behind a flat usage graph — and which fixes are a waste of time for your case. Free, no account, nothing saved.',
  lead:'You launched and the graph is flat. Five completely different reasons look identical from the outside, and their fixes point in opposite directions — so guessing wrong costs you a quarter. Three questions and you get which one you are in.',
  out:'Which of the five you are in, why the other four are not it, and the cheap test that confirms it.',
  answers:[
   ['Nobody saw it','A reach problem, and the only one where more traffic is the answer.'],
   ['They saw it and did not understand it','Usually read as a traffic problem and answered with a bigger budget.'],
   ['They did not need it','The expensive one. Neither traffic nor a better product fixes it.'],
   ['Moving to you was too much work','The problem is real. Switching costs them an afternoon they do not have.'],
   ['It is not good enough yet','The only one where “make it better” is genuinely the right answer.']],
  faqs:[
   ['Why is nobody using my product?','There are five common reasons and in analytics they look identical: nobody saw it; they saw it and did not understand what it was; they understood it and did not need it; they needed it but moving off what they use today was too much work; or they tried it and it is not good enough yet. The fixes point in opposite directions, which is why the diagnosis matters more than the effort. More traffic only helps the first one and a better product only helps the last one.'],
   ['Does more marketing fix low usage?','Only if the reason is that nobody saw it. If people arrive and leave within seconds, more traffic sends more people to the same sentence that is already not working. If they arrive and do not need what you built, more traffic sends more people to something they also do not need — at a higher cost each time.'],
   ['How do I know if people actually need my product?','Ask what they do about the problem today. People who genuinely have a problem have already built something ugly and manual to cope with it — a spreadsheet, a group chat, a recurring reminder. When nobody can describe any workaround at all, that is usually the finding, and it is worth one afternoon of conversations to confirm before spending another quarter.']],
  q:[['What happens when somebody lands on your page?',[['Almost nobody lands there at all',4],['They land and leave within seconds',3],['They sign up, then stop',1],['They use it a bit, then drift away',0]]],
     ['When you ask people what they do today instead, what do they say?',[['They describe an ugly workaround they hate',0],['They have a workaround and seem fine with it',2],['Nothing. They have never had to solve this',4]]],
     ['Of the people who tried it, how many came back on their own?',[['Several, more than once',0],['One or two',2],['None',4]]]],
  b:[
   {max:2,name:'They came back. It is just not good enough yet.',
    sub:'The best of the five, and the only one where “make the product better” is actually the right answer.',
    body:'<p>They found it, understood what it was, tried it, and some came back without being reminded. That last part is the only signal I really trust, and you have it.</p>'+
         '<p>It is also the one people assume they are in most often, usually wrongly, because it is the most flattering explanation available. <strong>If nobody came back on their own, you are not here.</strong></p>',
    next:['Ask the people who came back what they almost gave up on. Push past their first, polite answer.','Fix what appears in two of those conversations, not what appears in one.','Do not start marketing yet. Pushing more people through a nearly-good product wastes the introduction.']},
   {max:5,name:'They want it. Moving to you is too much work.',
    sub:'The problem is real and they agree. Switching would still cost them an afternoon they do not have.',
    body:'<p>They have a workaround, they do not love it, and they still have not moved. That gap is almost never about missing features — teams keep tools they openly complain about for years.</p>'+
         '<p>It is about the cost of moving: their data is elsewhere, their colleague knows the old thing, and switching means being slower for a week to be faster later. <strong>Most people will not take that trade even when the maths is obviously in their favour.</strong></p>',
    next:['Write down every single thing somebody must do before they get any value.','Delete or automate half of them. Import from where their data already lives, even badly.','Make it useful before setup is finished, not after.']},
   {max:8,name:'They saw it and did not understand it.',
    sub:'People arrive and leave within seconds. That is what you are saying, not how many people you are reaching.',
    body:'<p>This gets misdiagnosed as a traffic problem more than any other, and answered with a bigger ad budget — which sends more people to the same sentence that is already not working.</p>'+
         '<p>Cheapest test I know, and it takes an afternoon: <strong>show your homepage to five people for eight seconds, hide it, and ask what the product does.</strong> If two are wrong, you are here. Not partly wrong — wrong.</p>',
    next:['Run the eight-second test on five people who do not know what you do.','Rewrite the first sentence in their words, not your internal ones.','Say what it replaces. “Instead of X” lands faster than any description of what you built.']},
   {max:99,name:'They did not need it.',
    sub:'The expensive one, and the one everybody spends months avoiding.',
    body:'<p>Nobody can describe a workaround and nobody came back. That combination has one boring explanation, and it is the one nobody wants: <strong>the problem is not painful enough to act on.</strong></p>'+
         '<p>What makes it expensive is that both escape routes are dead ends. Distribution does not fix it — more people arrive at something they also do not need. A better product does not fix it either, because quality was never the objection.</p>'+
         '<p>The good news: it is the cheapest one to <em>confirm</em>. One afternoon and nine honest conversations about the last time the problem actually happened to them.</p>',
    next:['Talk to nine people. Ask only about the last time it happened, and never mention your product.','Count how many had done something manual and annoying about it. Under three, believe it.','Look for the adjacent problem instead of rebuilding. It is usually one step away, with the same users.']}]},

{ id:'feedback', cat:'users', slug:'is-user-feedback-real-or-just-polite',
  n:'Was that feedback real, or just polite?',
  time:'1 minute', count:'5 questions',
  title:'Is That User Feedback Real, or Just Polite? — Free Check',
  meta:'Five questions about one user conversation tell you whether what somebody said is evidence you can build on or good manners you should not. Free, takes a minute, nothing saved.',
  lead:'Somebody told you they would use it, or that they loved it. Before you build anything on top of that sentence, five questions about that exact conversation will tell you whether it was evidence or good manners.',
  out:'A verdict on that one conversation, and the cheapest next move for it.',
  answers:[
   ['Real signal','Unprompted, repeated, with a workaround they would have to give up.'],
   ['Promising, but a leg is missing','One more conversation before you build anything.'],
   ['A polite no','Enthusiasm after a demo, with nothing underneath it.'],
   ['No signal at all','Nothing here says the problem exists outside your own head.']],
  faqs:[
   ['How do I know if user feedback is real or just polite?','Four things separate evidence from good manners: whether they said it before you showed your solution rather than after, whether they already have a workaround they dislike, whether they have done the thing again without you in the room, and whether you can name a second person who asked unprompted. Enthusiasm after a demo, with no workaround and no repeat use, is a no in better clothes.'],
   ['Why do users say they like something and then never use it?','Because in a demo they are reacting to your effort, not to their problem. Being encouraging is the socially correct response to somebody showing you something they made, and “that’s interesting” is what a considerate person says instead of “no”. It is indistinguishable from real interest at the moment it happens, which is what makes it expensive.'],
   ['What questions should I ask in a user interview?','Ask about the last time the problem happened, in detail, before you describe your solution — or ideally without describing it at all. What did they do, what did it cost them, what did they try first. Past behaviour is checkable. Any question about the future, including “would you use this”, produces a polite guess rather than information.']],
  q:[['Did they say it before or after you showed your solution?',[['Before, unprompted',0],['After I described it',2],['After I demoed it',4]]],
     ['Do they already have a workaround for this?',[['Yes, an ugly one they hate',0],['Yes, and they seem fine with it',2],['No workaround at all',4]]],
     ['Have they done the thing again since, without you in the room?',[['Yes, more than once',0],['Once',2],['Not yet',4]]],
     ['What did they ask next?',[['How much does it cost',0],['When can I have it',1],['Nothing',3],['“That’s interesting”',4]]],
     ['Can you name a second person who asked for this, unprompted?',[['Yes, by name',0],['Sort of',2],['No',4]]]],
  b:[
   {max:3,name:'That one counts.',
    sub:'About as close to evidence as you get before shipping anything.',
    body:'<p>Unprompted, an ugly workaround they would have to give up, repeat behaviour without you watching, and a second person you can name. Any one alone is weak. <strong>Together they are rare and worth moving on quickly.</strong></p>'+
         '<p>The waste here is treating it as encouragement and going back to your roadmap. It is not encouragement, it is a specification. The workaround they described is the product — copy it in their words, including the parts that look stupid. Those parts are usually load-bearing.</p>',
    next:['Write their workaround down step by step, in their language, today.','Build the smallest thing that removes the worst step. Not the whole flow.','Check the second person describes the same problem. If not, you have two products.']},
   {max:8,name:'Promising, but a leg is missing.',
    sub:'There is something real here. Have one more conversation before you build.',
    body:'<p>Most of the signal is there, but one piece is not — usually the second person, or evidence they did it again on their own. Those two separate a real pattern from one enthusiastic individual.</p>'+
         '<p>The trap is that it feels close enough to justify starting, and starting feels better than asking. <strong>A prototype built on four fifths of a signal takes weeks and answers nothing you could not have learned in an hour.</strong></p>',
    next:['Find one more person with the same problem, through them if possible.','Ask about the last time it happened. Do not mention your solution until the end, if at all.','If they describe it the same way, you are clear to build the smallest version.']},
   {max:13,name:'That was a polite no.',
    sub:'Enthusiasm after a demo, no workaround, no repeat use, no second person. Each of those is the shape of somebody being kind to you.',
    body:'<p>People are generous in demos. They are reacting to your effort, not to their problem, and “that’s interesting” is what a considerate person says instead of “no”.</p>'+
         '<p>This one is worth catching early because it is <strong>indistinguishable from real interest at the moment it happens</strong>, and it feels great. That combination is how good teams spend months on something nobody was waiting for.</p>'+
         '<p>None of it means the idea is dead. It means this conversation was not the evidence you thought, and you should stop counting it as one.</p>',
    next:['Go back and ask what they do about it today. If the honest answer is “nothing”, you have your answer.','Stop demoing. Ask about the last time, before you show anything.','Set a rule: two people who found their own workaround, or you do not build it.']},
   {max:99,name:'There is no signal here yet.',
    sub:'Nothing in this conversation says the problem exists outside your own head.',
    body:'<p>Not fatal, and not an insult — plenty of good products started as somebody’s private annoyance. It becomes fatal the moment you stop looking for the second person and start looking for encouragement, which is an easy switch to make without noticing.</p>'+
         '<p>The honest question, and it is not rhetorical: <strong>if nobody has ever built an ugly manual version of this by hand, is the pain actually there?</strong> People solve problems that hurt. Badly, in spreadsheets, with a lot of copy-pasting — but they solve them.</p>',
    next:['Go looking for the ugly manual version. Forums, spreadsheets, a channel someone maintains by hand.','Find one and that is your product and its users. Find none after a week and believe it.','Keep the idea. Change the question from “would you use this” to “what did you do last time”.']}]},

{ id:'build', cat:'decisions', slug:'is-this-feature-worth-building',
  n:'Is this feature worth building?',
  time:'40 seconds', count:'4 questions',
  title:'Is This Feature Worth Building? — Free 4-Question Check',
  meta:'Four questions separate a real user need from a loud request before it reaches your roadmap — and give you a reason you can say out loud to whoever asked. Free, no account.',
  lead:'Something has been requested enough times that it is getting hard to say no. Four questions separate a real need from a loud request, and give you a reason you can say out loud to the person who asked.',
  out:'Build it, build a smaller version, wait, or say no — with the reason behind it.',
  answers:[
   ['Build it','Unprompted demand, a workaround people maintain by hand, a measurable cost to doing nothing.'],
   ['Build the smallest version','Real demand underneath, not enough to justify the full thing yet.'],
   ['Not yet','The request is loud but nothing under it proves the need.'],
   ['This is a request, not a need','It arrived from inside, with nothing behind it.']],
  faqs:[
   ['How do I decide if a feature is worth building?','Look at who asked and whether it was unprompted, what those people do about the problem today, and what measurably happens if you never build it. Several users who each built their own ugly workaround is a need. One loud voice with no workaround behind it is a preference, and preferences do not belong on a roadmap.'],
   ['Should I build what a big customer asks for?','Only if you can find the same need in people who are not that customer. A large account can fund a feature and still be the only place it is ever used, which leaves you maintaining it forever. The question that settles it is what they do about the problem today — if the answer is nothing, they are describing a preference with a budget attached.'],
   ['How do I say no to a feature request?','Say what you would need to see to say yes, and mean it. “Nobody who asked for this has built a workaround for it, so we do not think the need is there yet — if that changes, tell me” is refusable, checkable, and does not sound like a brush-off. A vague “it is not on the roadmap” invites the same request again next month.']],
  q:[['Who asked for it?',[['Several users, unprompted',0],['One user, repeatedly',2],['One large customer',3],['Somebody inside the company',4]]],
     ['What do those people do about it today?',[['An ugly manual workaround',0],['They use a competitor for this bit',1],['Nothing, they live with it',3],['We do not actually know',4]]],
     ['If you never built it, what happens?',[['We lose a paying customer',0],['Some people stay annoyed',2],['Nothing we could measure',4]]],
     ['How long would a rough version take?',[['A few days',0],['Two or three weeks',2],['More than a month',3],['Nobody has estimated it',4]]]],
  b:[
   {max:3,name:'Build it. This one is real.',
    sub:'Unprompted demand, a workaround people already maintain by hand, and a measurable cost to doing nothing.',
    body:'<p>This is the rare case where the request and the need are the same thing. The people asking have already proved it matters by doing the work manually.</p>'+
         '<p>One warning: <strong>build what their workaround does, not what they asked for.</strong> Requests arrive as solutions, and the solution somebody imagines is usually a worse version of what they actually do every day.</p>',
    next:['Watch two of them do the manual version. Record it if they let you.','Build the smallest thing that removes the worst step of it.','Ship to those people first and check they stop doing the manual version. If they do not, you built the wrong part.']},
   {max:8,name:'Build the smallest version of it.',
    sub:'There is real demand under this, but not enough to justify the full thing yet.',
    body:'<p>Something is here — the signal just is not strong enough to earn a month of work. The mistake at this point is treating the choice as build-or-not, when the useful third option is <strong>build a tenth of it and see who uses it.</strong></p>'+
         '<p>A rough version that solves eighty percent for the people asking will tell you more in two weeks than any amount of further discussion, and it costs a fraction of being wrong at full scale.</p>',
    next:['Define the smallest version that would still be genuinely useful. Not a demo — usable.','Ship it to the people who asked, by name, and watch what they do.','Decide in advance what usage would justify building the rest.']},
   {max:12,name:'Not yet. Find out what they actually do.',
    sub:'The request is loud but nothing underneath it proves the need.',
    body:'<p>Nobody has a workaround, or nothing measurable happens if this never exists. Those are the two signs that you are looking at a preference rather than a problem — and preferences are infinite, which is why roadmaps built on them never end.</p>'+
         '<p>This is not a no. It is a <strong>“we do not know yet”</strong>, and the difference matters when you go back to the person who asked.</p>',
    next:['Ask three people who requested it what they did the last time they needed it.','If the answer is “nothing”, it is a preference. Say so kindly and move on.','If a workaround appears, come back and run this check again.']},
   {max:99,name:'This is a request, not a need.',
    sub:'It came from inside, or from one voice, with nothing behind it and no measurable cost to ignoring it.',
    body:'<p>The most expensive features are rarely the ones users demanded. They are the ones that arrived from a meeting, sounded reasonable, and nobody had a good reason to refuse.</p>'+
         '<p><strong>“No good reason to refuse” is not a reason to build.</strong> Everything on a roadmap costs the thing it displaced, and that cost never shows up in the discussion about whether to add it.</p>',
    next:['Ask what problem it solves and who has it. If the answer is a job title, not a person, stop.','Write it down somewhere visible instead of building it. Most of these never come back.','If it returns three times from three different people, run this check again. It will score differently.']}]},

{ id:'decide', cat:'decisions', slug:'should-you-decide-now-or-think-longer',
  n:'Should you decide this now, or think longer?',
  time:'40 seconds', count:'4 questions',
  title:'Should You Decide Now or Think Longer? — Free Check',
  meta:'Four questions tell you how much of your time a decision actually deserves, based on how hard it would be to undo rather than how important it feels. Free, forty seconds.',
  lead:'You have been going round the same decision for two weeks. Most people agonise over things they could undo in a week and rush the ones they live with for years — four questions tell you which kind yours is.',
  out:'How much of your time this decision deserves, and the one check to run before you commit.',
  answers:[
   ['Decide today','You can undo it quickly. More deliberation is the expensive mistake.'],
   ['Decide this week','Reversible, but not for free. Write down what would reverse it.'],
   ['Do not decide yet','Spend everything on making the discovery cheap instead.'],
   ['You will live with this one','Pricing customers saw, a hire, a market. These do not get reversed.']],
  faqs:[
   ['How much time should a decision get?','It depends on how hard it is to undo, not how important it feels. A decision you can reverse in days should be made today, because another week of meetings costs more than being wrong. A decision customers have seen, like pricing, or one that other work gets built on top of, deserves all the time you have.'],
   ['What is a reversible decision?','One you could undo quickly and quietly, where almost nobody outside the team would notice and nothing else gets built on top of it. The useful test is whether you can say how you would undo it in a single sentence. If you cannot, it is not reversible — you are hoping it is, and that is how reversible decisions quietly become permanent ones.'],
   ['How do you stop a team going round the same decision?','Write down what was decided, why, what was rejected and what would change it, on the day it is made. Most repeated arguments are not disagreement — they are people genuinely remembering it differently, and without a record the loudest or most recent version wins each time.']],
  q:[['If this turns out badly, how long would it take to undo?',[['Days',0],['Weeks',1],['Months',3],['Not really, ever',4]]],
     ['Who finds out if you change your mind?',[['Just the team',0],['The whole company',1],['Customers',3],['The market',4]]],
     ['What does the next decision inherit from this one?',[['Nothing',0],['A constraint we can work around',2],['A promise we cannot break',4]]],
     ['What would it cost to find out you are wrong, before committing?',[['A few hours',0],['A few days',1],['Weeks',3],['We could only find out by doing it',4]]]],
  b:[
   {max:3,name:'Decide today.',
    sub:'You can undo this quickly and quietly. Another week of meetings is the more expensive mistake.',
    body:'<p>The cost of being wrong here is lower than the cost of the deliberation you are currently spending on it. That is unusual and worth using.</p>'+
         '<p>Teams get this backwards constantly, because a decision that feels important gets treated as if it were permanent. <strong>Importance and reversibility are different things,</strong> and only one of them should decide how long you spend.</p>',
    next:['Say the undo out loud in one sentence. If you cannot, you are in the next bucket.','Pick, and tell people it is a decision, not an experiment. Half-decisions get relitigated weekly.','Put a date in the calendar to revisit it, then stop discussing it until then.']},
   {max:8,name:'Decide this week — and write down what would reverse it.',
    sub:'This can be undone, but not for free. Somebody will notice, or something will get built on top.',
    body:'<p>The most common shape, and the one that goes wrong most quietly. It is genuinely reversible the day you make it and slightly less so every week after, and nobody ever announces the moment it stopped being reversible.</p>'+
         '<p>So the decision is only half the work. The other half is <strong>writing down now what would make you reverse it</strong> — a number, a date, a specific complaint — before you are attached to being right.</p>',
    next:['Decide, and write one sentence: “We will reverse this if ___ by ___.”','Put it somewhere the team will see again, not in your notes app.','Check it on the date. Actually check it. That is the entire trick.']},
   {max:12,name:'Do not decide yet.',
    sub:'Undoing this costs real time and other people will feel it. Spend everything on making the discovery cheap.',
    body:'<p>At this level the question stops being “what should we do” and becomes something more useful: <strong>what is the smallest thing that would change our minds?</strong> That reframing is worth more than another meeting, because it is answerable.</p>'+
         '<p>Nine conversations. A fake announcement to thirty people who match your users. A version done by hand for one week where you are the software. All unglamorous, all cheaper than being wrong at this scale.</p>',
    next:['Write the two-day version of the test. If you cannot think of one, you have not tried long enough.','Run it this week, not after the next sprint.','Agree in advance what result means what. Deciding that afterwards is choosing your favourite interpretation.']},
   {max:99,name:'You will live with this one.',
    sub:'It deserves all the time you have. Pricing customers have seen, a hire, a market, a promise made in public.',
    body:'<p>These do not get reversed. They get lived with, and everything built afterwards inherits their shape, usually in ways nobody predicted.</p>'+
         '<p>There is no such thing as over-thinking one of these, but there is such a thing as thinking about it alone. <strong>The failure mode here is not haste. It is agreement.</strong></p>'+
         '<p>Before you commit, get the person who disagrees to write down why, with a date on it. Not to change your mind — so that in nine months there is a record of what was foreseeable, instead of everyone quietly rewriting what they thought.</p>',
    next:['Find the person who disagrees. If nobody does, you have not asked outside the room.','Get the objection in writing, dated, before you commit.','Write your own one-page version of why. Over a page means you are still convincing yourself.']}]},

{ id:'charge', cat:'growth', slug:'can-you-charge-for-your-product-yet',
  n:'Can you charge for this yet?',
  time:'40 seconds', count:'4 questions',
  title:'Can You Charge For Your Product Yet? — Free Check',
  meta:'Four questions on willingness to pay tell you whether you are ready to put a price on it, or whether charging now would teach you the wrong thing. Free, forty seconds, nothing saved.',
  lead:'You are wondering whether to put a price on it, or whether it is too early and asking for money would kill the momentum you have. Four questions and you will know which.',
  out:'Whether you are ready to charge, and what to fix first if you are not.',
  answers:[
   ['Charge now','People ask the price, already pay for something worse, and would notice if it vanished.'],
   ['Charge, but keep it simple','Demand is real. Your explanation of the value is not ready.'],
   ['Not yet','Nobody has asked what it costs. That is the signal.'],
   ['Charging now would teach you the wrong thing','A few sympathetic payments look like validation and are not.']],
  faqs:[
   ['How do I know if I can charge for my product yet?','The strongest signal is people asking what it costs before you bring price up. After that: whether they already pay for something to solve this problem, whether anyone would complain if you switched it off tomorrow, and whether you can say in one sentence what somebody gets for the money without having to explain it.'],
   ['Should I launch free and charge later?','Free is a reasonable place to be while you are still learning what the product is, but it teaches you almost nothing about what somebody will pay for. Free users tolerate things paying users will not, and the switch later is harder than introducing a price early. If people are already asking the price, waiting is costing you information as well as money.'],
   ['How should I price a new product?','Start with one price, one sentence and one thing it does. Tiers are almost always a symptom of not being sure what you are selling, and users read that uncertainty accurately. The first number will be wrong, which is fine — a price is much easier to change than to introduce.']],
  q:[['Has anyone asked what it costs, without you bringing it up?',[['Yes, more than once',0],['Once',2],['No',4]]],
     ['What do people pay for today to solve this problem?',[['A tool with a real price',0],['Somebody’s time',1],['Nothing at all',4]]],
     ['If you switched it off tomorrow, who would complain?',[['Named people, immediately',0],['A few, eventually',2],['Honestly, nobody',4]]],
     ['Can you say in one sentence what somebody gets for the money?',[['Yes, and users repeat it back to me',0],['Yes, but I have to explain it',2],['Not really',4]]]],
  b:[
   {max:3,name:'Charge now. You are probably late.',
    sub:'People are asking the price, they already pay for something worse, and they would notice if it disappeared.',
    body:'<p>Every signal that matters is present. What is holding you back is not evidence, it is nerves — and waiting has a cost people underestimate, because <strong>free users teach you almost nothing about what somebody will pay for.</strong></p>'+
         '<p>Price it, tell your existing users first and honestly, and give the early ones something for having been early. Nobody resents a price they saw coming.</p>',
    next:['Pick a number today. It will be wrong, and that is fine — it is easier to change than to introduce.','Tell existing users before it goes public, with a reason and a date.','Watch who leaves. If nobody does, you priced it too low. That is information, not a failure.']},
   {max:8,name:'Charge, but keep it simple.',
    sub:'The demand is real enough. What is not ready is your explanation of the value.',
    body:'<p>You have enough to justify a price, but if you have to explain what someone gets, the pricing page will have to explain it too — and pricing pages are the worst place to teach anything.</p>'+
         '<p>So resist the tiers. <strong>One price, one sentence, one thing it does.</strong> Complexity in pricing is almost always a symptom of not being sure what you are selling, and users read that uncertainty accurately.</p>',
    next:['Write the one sentence: “You pay X and you get Y.” If it needs a second sentence, it is not ready.','Launch a single price. No tiers, no annual discount, nothing to compare.','Ask three people to repeat the sentence back. Rewrite until they can.']},
   {max:12,name:'Not yet — but do not wait for perfect.',
    sub:'Nobody has asked the price, and that is the signal to pay attention to.',
    body:'<p>When something is genuinely valuable, people ask what it costs before you tell them. Silence on price usually means they are treating it as a nice thing to try, not a thing they need.</p>'+
         '<p>The mistake now would be to build more, hoping value arrives with features. <strong>It rarely does.</strong> The gap is normally that the product has not yet done one important thing all the way to the end for anybody.</p>',
    next:['Find one user and get them all the way to a real outcome, manually if necessary.','Ask them, plainly, what they would pay. Their hesitation tells you more than the number.','Come back and run this again once somebody has asked you the price first.']},
   {max:99,name:'Charging now would teach you the wrong thing.',
    sub:'Nobody pays for anything here, nobody would complain if it vanished, and you cannot say what somebody gets.',
    body:'<p>You could probably get a few people to pay — friends, early supporters, someone being kind. That is exactly the risk. <strong>A handful of sympathetic payments looks like validation and is not,</strong> and it can point a whole year in the wrong direction.</p>'+
         '<p>The question underneath is not about pricing. It is whether anybody has a problem here expensive enough to spend money on, and that is worth answering before you spend months on a payment flow.</p>',
    next:['Answer the value question first — what does somebody actually get, in their words.','Check whether people pay for anything at all in this area today. If nothing, that is the finding.','Keep it free while you find that out. Free is a fine place to be when you are still learning.']}]},

{ id:'team', cat:'team', slug:'why-your-team-keeps-redoing-the-same-work',
  n:'Why does your team keep redoing the same work?',
  time:'40 seconds', count:'4 questions',
  title:'Why Does Your Team Keep Redoing The Same Work? — Free Check',
  meta:'Four questions find out why settled decisions keep coming back and work gets thrown away — and the smallest change that stops it. Free, forty seconds, nothing saved.',
  lead:'You ship constantly and it does not feel like progress. Decisions come back, work gets thrown away, and the same argument returns every few weeks. Four questions and you will know which of four causes it is.',
  out:'Which of four things is causing it, and the smallest change that stops it.',
  answers:[
   ['This is normal','Work gets redone because you learned something. That is not waste.'],
   ['Decisions are not written down','Made in conversation, remembered differently, quietly relitigated.'],
   ['Somebody is left out of the room','The same objection, arriving at the most expensive moment.'],
   ['Nobody can end an argument','Decisions are not made, they are abandoned — and abandoned things come back.']],
  faqs:[
   ['Why does my team keep redoing the same work?','Usually one of four reasons: you genuinely learned something new, which is not waste; decisions are made in conversation and never written down, so they get remembered differently and quietly relitigated; somebody with real veto power finds out too late and objects when the work is already done; or nobody is able to end an argument, so decisions are abandoned rather than made.'],
   ['How should a small team record decisions?','One running page, newest at the top, four lines per decision: what was decided, why, what was rejected, and what would change it. It takes ten minutes a week and it ends the category of argument where everyone remembers the same meeting differently. Anything heavier will be abandoned within a month.'],
   ['Who should make the final decision in a product team?','Name one person per area, chosen by who lives with the consequences rather than by seniority, and say it out loud in writing. Everyone else gets the right to be heard before the decision and no right to reopen it afterwards. Consensus is a good input and a terrible decision rule, because anything that cannot be closed comes back.']],
  q:[['How do decisions get recorded?',[['Written down where anyone can find them',0],['In a doc one person owns',1],['In chat, somewhere',3],['They do not',4]]],
     ['How often does a settled decision come back?',[['Rarely',0],['Every month or so',2],['Every sprint',4]]],
     ['When work gets redone, why usually?',[['New information arrived',0],['Somebody was not consulted',3],['Somebody changed their mind',4]]],
     ['Who can end an argument?',[['One clear person, and everyone knows who',0],['Depends on the topic',2],['Nobody. It just fades out',4]]]],
  b:[
   {max:3,name:'This is normal. Do not fix it.',
    sub:'Work gets redone because new information arrived, and decisions mostly stay decided.',
    body:'<p>Redoing work in response to something you learned is not waste — it is the entire point of working iteratively. The waste is redoing it because nobody remembered why it was decided.</p>'+
         '<p><strong>You do not have a process problem.</strong> Adding process here would slow you down and solve nothing, which is the most common way good teams get worse.</p>',
    next:['Leave it alone.','If it starts to hurt, run this again. The answer will change.','Spend the energy you were about to spend on process on talking to users instead.']},
   {max:8,name:'Your decisions are not written down.',
    sub:'They are made in conversation, remembered differently by everyone, and quietly relitigated later.',
    body:'<p>The tell is arguments that feel familiar. Nobody is being difficult — they genuinely remember it differently, and without a record the loudest or most recent version wins.</p>'+
         '<p>The fix is smaller than any process anyone will propose in response. <strong>Four lines, written the day of the decision: what we decided, why, what we rejected, what would change it.</strong> Ten minutes, and it ends the category.</p>',
    next:['Start a single running document. One page, newest at the top, nothing fancy.','Four lines per decision. What, why, what we rejected, what would change it.','When an old argument returns, do not re-argue it. Link the entry and move on.']},
   {max:12,name:'Somebody is being left out of the room.',
    sub:'Work gets redone because a person who could have objected found out too late.',
    body:'<p>This is usually structural rather than personal. Someone with real veto power — an engineer who knows what is expensive, a support lead who knows what breaks — is not present when the decision happens, and finds out when the work is already done.</p>'+
         '<p>By then their objection costs a rebuild, so it feels like obstruction. <strong>It is not obstruction. It is the same objection, arriving at the most expensive possible moment.</strong></p>',
    next:['List the last three things that got redone. Write down who objected each time.','If it is the same name, they belong in the room before the decision, not after.','Ask them directly what they would have said. It takes five minutes and saves weeks.']},
   {max:99,name:'Nobody can end an argument.',
    sub:'Decisions do not get made, they get abandoned — and anything abandoned comes back.',
    body:'<p>Nothing is written down, decisions return every sprint, and no one person can close a discussion. That is not a communication problem. It is <strong>an unclear owner,</strong> and it will not be fixed by a better tool or a longer meeting.</p>'+
         '<p>The uncomfortable part is that the fix is not more consensus. It is naming who decides when there is no consensus — and accepting that being overruled sometimes is the price of moving.</p>',
    next:['Name the decider for each area, in writing. Not by seniority — by who lives with the consequences.','Give everyone else the right to be heard before, and no right to reopen it after.','Write down what was decided, or the previous point does not hold.']}]}
];

/** The "which check do I need" decision tree. */
export const CHAT: Record<string, any> = {start:{q:'What is going on right now?',o:[
  ['We built something and it is quieter than we expected','n_quiet'],
  ['Somebody gave us feedback and we do not know what to do with it','n_fb'],
  ['We are stuck on a decision','n_dec'],
  ['We ship constantly and it does not feel like progress','n_prog']]},
 n_quiet:{q:'Which of these is closest?',o:[
  ['People find it, sign up, and disappear','v_why'],
  ['We are starting to think the idea itself might be wrong','v_feedback'],
  ['We cannot tell whether anyone would pay for it','v_charge']]},
 n_fb:{q:'Where did it come from?',o:[
  ['One person, and they were very enthusiastic','v_feedback'],
  ['Several users asking for the same feature','v_build'],
  ['A large customer asking for something specific','v_build']]},
 n_dec:{q:'What is it about?',o:[
  ['Pricing, or whether to charge at all','v_charge'],
  ['What to build next','v_build'],
  ['Something big and hard to undo','v_decide']]},
 n_prog:{q:'What does the waste look like?',o:[
  ['We redo the same work over and over','v_team'],
  ['We ship, but usage never moves','v_why'],
  ['We argue about priorities every single sprint','v_decide']]},
 v_why:{t:'why',lead:'Start with why nobody is using it.',
   why:'Before anything else you need to know <strong>which</strong> kind of quiet you have. Five different reasons produce the same flat graph and their fixes point in opposite directions, so effort spent before the diagnosis is usually effort spent on the wrong one.'},
 v_feedback:{t:'feedback',lead:'Start with whether that feedback was real.',
   why:'The doubt you are describing usually traces back to one or two conversations that felt encouraging. Test those directly before you conclude anything about the idea — enthusiasm and evidence are very different things and they arrive looking identical.'},
 v_build:{t:'build',lead:'Start with whether it is worth building.',
   why:'A repeated request is not the same as a need, and the difference is visible in what those people already do about it today. This one is built for exactly that gap, and it gives you a reason you can say out loud to whoever asked.'},
 v_decide:{t:'decide',lead:'Start with how much time this decision deserves.',
   why:'Before working out the answer, work out how much thinking it has earned. Most stuck decisions are either reversible ones being over-discussed or permanent ones being rushed, and those need opposite treatment.'},
 v_charge:{t:'charge',lead:'Start with whether you can charge yet.',
   why:'Willingness to pay is the fastest test of whether the value is real, and it is answerable today. It also tends to settle the other arguments — a product people ask the price of has a different set of problems than one they do not.'},
 v_team:{t:'team',lead:'Start with why the work keeps coming back.',
   why:'Repeated rework is almost never about effort or discipline. It comes from one of four specific causes, and three of them are fixed by something that takes ten minutes a week.'}
};

export const byId = (id: string) => TOOLS.find((t) => t.id === id);

/** "Before you start." — the index FAQ, verbatim from the prototype. */
export const INDEX_FAQ_HTML = `<details><summary>Are these really free?<span class="pm">+</span></summary><div class="ans">
      <p>Yes. No account, no email, no trial that turns into something. There is nothing to buy at the end of them.</p>
      <p>They exist because the questions inside are the ones I ask in the first twenty minutes of any project, and there is no reason to charge for the first twenty minutes.</p></div></details>
    <details><summary>Where do my answers go?<span class="pm">+</span></summary><div class="ans">
      <p>Nowhere. Everything runs in your browser. Nothing is sent to a server, nothing is stored, and I never see what you clicked — which also means your result disappears when you close the tab.</p></div></details>
    <details><summary>How accurate is the answer?<span class="pm">+</span></summary><div class="ans">
      <p>Treat it as a strong opinion from somebody who has made the same call before, not a diagnosis. A handful of questions cannot know your product.</p>
      <p>What it is genuinely good at is stopping you from fixing the wrong thing. Most wasted quarters are not bad execution — they are excellent execution pointed at the wrong problem.</p></div></details>
    <details><summary>Why is nobody using my product?<span class="pm">+</span></summary><div class="ans">
      <p>There are five common reasons and in analytics they look identical: nobody saw it; they saw it and did not understand what it was; they understood it and did not need it; they needed it but moving off what they use today was too much work; or they tried it and it is not good enough yet.</p>
      <p>The fixes point in opposite directions. More traffic only helps the first one, a better product only helps the last one — which is why guessing is expensive. <a class="tl" href="tools/why-is-nobody-using-your-product.html">The first check</a> tells you which one you are in.</p></div></details>
    <details><summary>How do I know if user feedback is real?<span class="pm">+</span></summary><div class="ans">
      <p>Four things separate evidence from good manners. Did they say it <em>before</em> you showed them your solution, or after? Do they already have a workaround they dislike? Have they done the thing again without you in the room? Can you name a second person who asked, unprompted?</p>
      <p>Enthusiasm after a demo, with no workaround and no repeat use, is a no wearing better clothes.</p></div></details>
    <details><summary>How do I decide if a feature is worth building?<span class="pm">+</span></summary><div class="ans">
      <p>Look at who asked and whether it was unprompted, what those people do about it today, and what measurably happens if you never build it.</p>
      <p>Several users who each built their own ugly workaround is a need. One loud voice with no workaround behind it is a preference, and preferences do not belong on a roadmap.</p></div></details>
    <details><summary>Can I use these with my team?<span class="pm">+</span></summary><div class="ans">
      <p>Please do — that is the best use of them. Two people running the same check separately and comparing answers surfaces disagreements that meetings usually bury.</p>
      <p>Screenshot anything you want to put on a wall or in a doc. No permission needed.</p></div></details>`;
