/**
 * Only the index FAQ markup remains here. The six checks moved to
 * src/content/tools/*.yaml so they can be edited and validated as content —
 * see src/lib/content.ts.
 */

/** "Before you start.", the index FAQ, verbatim from the prototype. */
export const INDEX_FAQ_HTML = `<details><summary>Are these really free?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Yes. No account, no email, no trial that turns into something. There’s nothing to buy at the end of them.</p>
      <p>They exist because the questions inside are the ones I ask in the first twenty minutes of any project, and there’s no reason to charge for the first twenty minutes.</p></div></details>
    <details><summary>Where do my answers go?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Nowhere. Everything runs in your browser. Nothing is sent to a server, nothing is stored, and I never see what you clicked, which also means your result disappears when you close the tab.</p></div></details>
    <details><summary>How accurate is the answer?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Treat it as a strong opinion from somebody who has made the same call before, not a diagnosis. A handful of questions cannot know your product.</p>
      <p>What it’s genuinely good at is stopping you from fixing the wrong thing. Most wasted quarters are not bad execution — they’re excellent execution pointed at the wrong problem.</p></div></details>
    <details><summary>Why is nobody using my product?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>There are five common reasons and in analytics they look identical: nobody saw it; they saw it and did not understand what it was; they understood it and did not need it; they needed it but moving off what they use today was too much work; or they tried it and it’s not good enough yet.</p>
      <p>The fixes point in opposite directions. More traffic only helps the first one, a better product only helps the last one, which is why guessing is expensive. <a class="tl" href="/tools/why-is-nobody-using-your-product/">The first check</a> tells you which one you’re in.</p></div></details>
    <details><summary>How do I know if user feedback is real?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Four things separate evidence from good manners. Did they say it <em>before</em> you showed them your solution, or after? Do they already have a workaround they dislike? Have they done the thing again without you in the room? Can you name a second person who asked, unprompted?</p>
      <p>Enthusiasm after a demo, with no workaround and no repeat use, is a no wearing better clothes.</p></div></details>
    <details><summary>How do I decide if a feature is worth building?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Look at who asked and whether it was unprompted, what those people do about it today, and what measurably happens if you never build it.</p>
      <p>Several users who each built their own ugly workaround is a need. One loud voice with no workaround behind it’s a preference, and preferences do not belong on a roadmap.</p></div></details>
    <details><summary>Can I use these with my team?<span class="pm" aria-hidden="true">+</span></summary><div class="ans">
      <p>Please do — that’s the best use of them. Two people running the same check separately and comparing answers surfaces disagreements that meetings usually bury.</p>
      <p>Screenshot anything you want to put on a wall or in a doc. No permission needed.</p></div></details>`;
