/**
 * Marks a horizontal scroller with where it currently sits, so the CSS can
 * fade only the end that actually has more content behind it.
 *
 * A permanent fade on both sides is a lie once you have scrolled to the end,
 * and a fade on a row that fits is a lie from the start — both train people to
 * ignore the signal. Two booleans, set on scroll and on resize.
 */
export function rail(el: HTMLElement) {
  /**
   * A one-off nudge the first time the rail comes into view.
   *
   * The fade alone was not enough: people read a faded edge as "this is the
   * end, softly" rather than "there is more". Two centimetres of movement is
   * unambiguous, and it happens once — a rail that keeps twitching is worse
   * than one that never moved.
   */
  const nudge = () => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.scrollWidth <= el.clientWidth + 4) return;
    el.scrollTo({ left: 28, behavior: 'smooth' });
    setTimeout(() => el.scrollTo({ left: 0, behavior: 'smooth' }), 520);
  };

  const seen = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        seen.disconnect();
        setTimeout(nudge, 320);
      }
    },
    { threshold: 0.6 }
  );
  seen.observe(el);

  const update = () => {
    const max = el.scrollWidth - el.clientWidth;
    el.dataset.start = String(el.scrollLeft <= 1);
    el.dataset.end = String(el.scrollLeft >= max - 1);
  };
  el.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(el);
  update();
}

/** Every rail on the page. */
export function rails(selector = '.rail') {
  document.querySelectorAll<HTMLElement>(selector).forEach(rail);
}
