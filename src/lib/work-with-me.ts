/**
 * Content for /work-with-me/.
 *
 * Extracted verbatim from the approved prototype rather than retyped, so the
 * copy is character-for-character what Sergio signed off on. Structure matches
 * the Figma frame "Work with me".
 */

export type Option = [string, string, string];
export type Question = { k: string; q: string; o: Option[] };

/** The four qualifier questions. */
export const Q: Question[] = [{k:'sit',q:'Where are you right now?',o:[
 ['idea','I have an idea and I have not built it yet','Deciding whether to, or what the first version even is.'],
 ['built','We built something and launched it','And it is quieter than we expected.'],
 ['growing','It works and it is growing','And design is now the bottleneck, or about to be.'],
 ['team','It works, but the team or the process is stuck','Shipping once was fine. Shipping repeatedly is not.'],
 ['made','We have made something and want a second pair of eyes','Before it goes out, or before we build more on top.']]},
{k:'want',q:'What do you actually want from me?',o:[
 ['decide','One decision settled, properly','There is a specific fork and we keep going round it.'],
 ['find','To find out what is wrong','We genuinely do not know, and everyone has a theory.'],
 ['critique','An honest read on what we have made','Tell us what is weak before our users do.'],
 ['inside','Somebody in the room while we work it out','Not one answer. A few months of them.'],
 ['do','Somebody to execute a plan we have agreed','The thinking is done. We need hands.']]},
{k:'who',q:'Who can act on the answer?',o:[
 ['me','Me, and I can change the plan this week','Founder, head of product, or close enough.'],
 ['team','My team, once I have taken it to them','I would have to convince people, but they listen.'],
 ['above','It would need approval from above','And that takes a while.'],
 ['none','Nobody yet. We are exploring','No mandate, no budget, no urgency.']]},
{k:'when',q:'When?',o:[
 ['now','This week. Something is on fire',''],
 ['month','Within the next month',''],
 ['quarter','This quarter, roughly',''],
 ['open','No date. I am just looking','']]}];

/** The seven possible outcomes. */
export const OUT: Record<string, any> = {session:{lab:'My recommendation',name:'A working session',meta:'Ninety minutes · usually within a week',kind:'session',
 why:'<p>You have a specific fork, and what you need is not more analysis. It is somebody to think it through properly with you and then <strong>commit to an answer</strong> — which is the part groups find hardest, because committing means somebody has to be wrong later.</p>'+
     '<p>Ninety minutes, no preparation from you. I read whatever context you send beforehand so we do not spend the first twenty minutes on background.</p>',
 get:['A decision, committed to — not a list of considerations','A written record of every option ruled out and why, within 48 hours','The reasoning in a form your team can argue with','Usually more useful internally than the decision itself'],
 not:['A design deliverable','A research project'],
 note:'This is the smallest thing I do, and the one I would suggest first if you have never worked with me.'},

review:{lab:'My recommendation',name:'A product review',meta:'Five days · two per quarter',kind:'review',
 why:'<p>Something is wrong, three people have three theories, and none of them has evidence. That is exactly the situation this exists for — and the reason it takes five days rather than an afternoon is that <strong>the diagnosis is the expensive part</strong>, not the fix.</p>'+
     '<p>The reasons a product goes quiet look identical from the inside, and most of the fixes make the others worse. I have picked wrong twice, at a cost of two months and then a whole quarter.</p>',
 get:['Product, flows, existing research and numbers reviewed together','Up to nine conversations with your actual users','A ranked document — five things, in order, with the reasoning','A session where your team pulls it apart','Two follow-up calls, at two weeks and six weeks'],
 not:['A list of sixty improvements','A redesign'],
 note:'The nine user conversations are not optional. Without them this is a well-argued guess.'},

critique:{lab:'My recommendation',name:'A written critique',meta:'Three to five days · fully async',kind:'critique',
 why:'<p>You have made something and you want an honest read before your users give you one for free. This is the least disruptive thing I do — no meetings required and no access to your team.</p>'+
     '<p>I go through it the way a new user would, then the way somebody who has shipped this kind of thing would, and write down where those two disagree. <strong>That gap is where most of the problems live.</strong></p>',
 get:['A written critique of the flows, states and copy — not just the visuals','What breaks at the edges: empty, error, slow, and the account with 4,000 rows','What I would cut, and what I would not touch','A prioritised list, because thirty problems with no order is not useful','An optional call to argue with it'],
 not:['A redesign','A rubber stamp'],
 note:'The fastest way to find out whether the way I think is useful to you.'},

embedded:{lab:'My recommendation',name:'Embedded work',meta:'Ongoing · one client at a time',kind:'embedded',
 why:'<p>You do not need one answer. You need somebody in the room while the answers keep changing, who is not already invested in the plan you have.</p>'+
     '<p>Design work where design is genuinely the bottleneck, but that is never the whole job. Most of it is deciding what not to build, and <strong>writing the decision down so your team still has it after I leave.</strong></p>',
 get:['Inside your tools, your standups and your arguments','I decide with you, and disagree with you in front of your team','Design work where design work is genuinely the constraint','A written decision log that stays with you'],
 not:['A staffing solution','A replacement for a full-time hire'],
 note:'One condition: it only works if I can disagree with you in front of your team. If that is a problem, take the review instead.'},

capacity:{lab:'Straight answer',name:'You may need a hire, not me',meta:'But there is a version that works',kind:'capacity',
 why:'<p>“It works and design is the bottleneck” usually means you need <strong>capacity</strong>, and capacity is a hiring problem. I would be an expensive and temporary answer to it.</p>'+
     '<p>What I can genuinely help with is the part before the hire: what the role actually needs to be, what to screen for, and which of your current problems are design problems rather than decision problems. That is often one session, and it can save a bad hire — the most expensive mistake on this page.</p>',
 get:['A session on what the role should be and what to screen for','An honest read on which problems a hire will and will not solve','If you want it, a written critique so the new person starts with a map'],
 not:['Ongoing design capacity','A recruiter'],
 note:'Send the brief anyway. I would rather point you at the right thing than sell you the wrong one.'},

nope:{lab:'Straight answer',name:'Not me — and I would be a worse choice',meta:'Genuinely',kind:'nope',
 why:'<p>The thinking is done and you need it built. That work is better done by a designer you hire directly: cheaper than me, faster than me, and much closer to the product than I can be from outside.</p>'+
     '<p>I am not being modest. Paying an outside product designer to execute an agreed plan is paying a premium for friction, because I will keep asking why — and you have already answered that.</p>',
 get:['A recommendation, if you want one. I know good people','Nothing else, honestly'],
 not:['A billable engagement'],
 note:'Write anyway if you want a name. It costs you nothing and it is the useful thing I can do here.'},

notyet:{lab:'Honestly',name:'Not yet',meta:'Come back when something breaks',kind:'unsure',
 why:'<p>No mandate, no date, or nothing urgent. Paying me now would be a poor use of your money and of a slot somebody else needs more.</p>'+
     '<p>You will get most of the value from what is already free here — and if you come back in a month still stuck, <strong>you will know exactly what to brief me on</strong>, which makes the engagement half the length and twice as useful.</p>',
 get:['The guided conversation — it asks what is going wrong and tells you what I would look at','The writing, which is mostly what I got wrong and what it cost','A reply if you write anyway, because I answer everyone'],
 not:['A sales follow-up','A newsletter you did not ask for'],
 note:'This is roughly a third of what lands in my inbox, and all of it gets this same answer.'}
};

/** Routes a set of answers to one outcome. */
export function decide(a: Record<string, string>): string {if(a.want==='do')return 'nope';
  if(a.when==='open'||a.who==='none')return 'notyet';
  if(a.want==='critique')return 'critique';
  if(a.want==='inside')return a.who==='above'?'review':'embedded';
  if(a.sit==='growing'&&a.want!=='find')return 'capacity';
  if(a.want==='find'||a.sit==='built')return 'review';
  if(a.want==='decide')return 'session';
  return 'review';
}

/** Engagement types offered in the brief. */
export const KIND: [string, string][] = [['session','A working session on one decision'],['review','A product review'],
          ['critique','A written critique of what we have made'],['embedded','Ongoing embedded work'],
          ['capacity','Help before hiring a designer'],['unsure','I do not know — tell me what fits']];

/** Step 4 of the brief changes with the recommendation. */
export const SPECIFIC: Record<string, string[][]> = {session:[['s1','What is the decision?','textarea','State it as a question with two or more answers. “Do we build X or Y before the launch?”'],
          ['s2','What are the options on the table?','textarea','Including the ones you have ruled out, and why.'],
          ['s3','Is there a date this has to be settled by?','input','A conference, a board meeting, a sprint.']],
 review:[['s1','What are you seeing in the numbers?','textarea','Even roughly. Signups, activation, retention — and if you track nothing, say that.'],
         ['s2','What are the competing theories in your team?','textarea','List them. The disagreement is genuinely useful information.'],
         ['s3','Can I speak to up to nine of your users within a week?','select|Yes|Yes, but it needs arranging|No|We have no users yet','This one matters most.']],
 critique:[['s1','What should I look at?','textarea','Links, a staging URL, a Figma file, a TestFlight build. Whatever exists.'],
           ['s2','Who is it for, and what should they be able to do?','textarea','One paragraph is enough.'],
           ['s3','Anything you already suspect is weak?','textarea','I will look anyway, but knowing where you are uneasy is useful.']],
 embedded:[['s1','What does your design capacity look like today?','textarea','Who does it, how much of their time, and what falls off the edge.'],
           ['s2','How long would you want this to run?','select|Three months|Six months|Ongoing, no end date|Not sure yet',''],
           ['s3','Where do decisions actually get made?','textarea','Which channel, which meeting, and who is in it.']],
 capacity:[['s1','What is falling over right now?','textarea','What is not getting done, and what that is costing you.'],
           ['s2','Have you started hiring?','select|Not yet|Written the role, not posted|Actively interviewing|Made a bad hire before',''],
           ['s3','What would a good version of this role own?','textarea','Even a rough answer helps.']],
 nope:[['s1','What kind of person are you looking for?','textarea','Seniority, focus, contract or permanent. I will point you at somebody if I can.']],
 unsure:[['s1','What made you look for help?','textarea','The specific moment, if there was one.'],
         ['s2','What would “this worked” look like in three months?','textarea','']]
};

/** "Do not hire me if…" markup. */
export const BLUNT_HTML = `<div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>You have already decided and you want it validated</h3>
        <p>Then you do not want a product designer, you want an alibi — and a cheaper one exists. I will read your plan, agree with the parts that are right, and say the rest out loud in front of whoever is in the room. If that sounds unpleasant, it will be.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>Nobody is allowed to talk to your users</h3>
        <p>Then you are paying me to guess with a straight face. I am very good at sounding certain, which is exactly why it would be the most expensive thing I could sell you. I will not do it.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>The person who can change the plan will not be in the room</h3>
        <p>Advice that has to travel through two people arrives as an opinion, and opinions lose to whoever is most tired. If your decision-maker cannot sit in it, this is theatre and we would both know by week two.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>You want a designer, not an opinion</h3>
        <p>I am not being modest — I would be a worse hire than the person you can get full-time. Cheaper, faster, closer to the product. Paying me to push pixels is paying a premium for friction.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>Nothing is actually on fire</h3>
        <p>Then do not. Read the free things here, run the conversation, come back when something breaks. About a third of what lands in my inbox is this, and all of it gets the same reply.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>You want to pay by the hour</h3>
        <p>Hourly billing pays me to be slow, and then we spend the whole thing quietly suspicious of each other. Fixed scope means we both want the same outcome: for this to be over, and correct.</p></div></div>
      <div class="b"><span class="x"><svg><use href="#xm"/></svg></span><div>
        <h3>You need it by Friday and today is Wednesday</h3>
        <p>Whatever I produced in two days would be confident, tidy and probably wrong — and you would act on it, because it would look like an answer. That is worse for you than having nothing.</p></div></div>`;

/** FAQ markup, mirrored by the FAQPage JSON-LD. */
export const FAQ_HTML = `<details><summary>How does this actually work?<span class="pm">+</span></summary><div class="ans">
      <p>It starts with a written brief rather than a call, because a brief takes you three minutes and a call takes us both an hour to discover something the brief would have said.</p>
      <p>You describe what is stuck. I read it and reply within a day with which kind of engagement fits, what it would involve and what it would cost. If none of them fit, I say that instead and point you somewhere more useful.</p></div></details>
    <details><summary>What is a product review, and what do I get at the end?<span class="pm">+</span></summary><div class="ans">
      <p>Five days on the product, the flows, whatever research already exists and the numbers, plus up to nine conversations with your actual users.</p>
      <p>What lands is a short ranked document: the five things that matter, in the order to do them, with the reasoning attached so your team can argue with it. Then a ninety-minute session where they do exactly that, and two follow-up calls at two and six weeks — because plans need adjusting once they meet reality, and handing over a PDF and disappearing is not a service.</p></div></details>
    <details><summary>How much does it cost?<span class="pm">+</span></summary><div class="ans">
      <p>I am not publishing prices at the moment. Send a brief and you will have a specific figure within a day, along with exactly what is included.</p>
      <p>What I can tell you now: scope and price are fixed before anything starts. No hourly billing, no open-ended engagements, and the number does not move depending on how well funded you look.</p></div></details>
    <details><summary>Do you really need to talk to our users?<span class="pm">+</span></summary><div class="ans">
      <p>For a review, yes, and this is the part clients resist most. Nine conversations is usually enough.</p>
      <p>Without them I am reviewing your product against my own assumptions. A guess delivered with confidence is more dangerous than no answer, because you will act on it.</p></div></details>
    <details><summary>What size of company do you work with?<span class="pm">+</span></summary><div class="ans">
      <p>Teams of roughly two to forty people building SaaS, mobile apps or internal tools.</p>
      <p>Above about a hundred people, or in enterprise and heavily regulated contexts, the bottleneck is almost always organisational rather than a design problem. I will tell you that in the first reply rather than take the money and find out together.</p></div></details>
    <details><summary>Can you just do the design work?<span class="pm">+</span></summary><div class="ans">
      <p>No, and not out of principle. Execution-only work is better done by somebody you hire full-time — cheaper, faster, and much closer to the product than I can be from outside.</p>
      <p>What an outside product designer is useful for is deciding what to build and being able to say why. That only works if the plan can still change.</p></div></details>
    <details><summary>What if we do not know what we need?<span class="pm">+</span></summary><div class="ans">
      <p>That is the most common starting point and it is a good one. Describe what is happening rather than what you think the solution is.</p>
      <p>Working out which problem you actually have is most of the job. Getting that wrong is what expensive quarters are made of.</p></div></details>
    <details><summary>Will you sign an NDA?<span class="pm">+</span></summary><div class="ans">
      <p>Standard mutual ones, without argument. You own everything produced, including documents and designs.</p>
      <p>One thing worth saying plainly: this site publishes decisions and mistakes, always my own. If I ever wanted to write about something we did together, I would ask first and you can say no.</p></div></details>
    <details><summary>How quickly do you reply?<span class="pm">+</span></summary><div class="ans">
      <p>Within a day, including to the people I turn down. If something is genuinely urgent, say so in the first line and I will reply the same day when I can.</p></div></details>
    <details><summary>Where are you, and how do we work together?<span class="pm">+</span></summary><div class="ans">
      <p>Barcelona, CET. Almost everything is remote and works across Europe without friction.</p>
      <p>I use whatever your team already uses — I am not going to make five people learn a new tool for a five-day engagement. For ongoing work I need access to the channels where decisions actually get made, not a new one created for me.</p></div></details>`;
