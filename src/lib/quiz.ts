/**
 * One questionnaire engine, used by the six checks and by the qualifier.
 *
 * They were two implementations of the same thing, and they had already
 * diverged: the back button subtracted the score in one and did not exist in
 * the other. Every accessibility fix had to be made twice.
 *
 * The two differ only in how an answer becomes a verdict, so that is the one
 * thing a caller supplies.
 */

export type Option = { label: string; note?: string; value: string | number };
export type Question = { key: string; text: string; options: Option[] };

export type QuizOptions<V> = {
  questions: Question[];
  /** Turns the collected answers into whatever the page wants to render. */
  resolve(answers: Option[]): V;
  /** Draws a question. */
  renderQuestion(q: Question, index: number, total: number): string;
  /** Draws the verdict. */
  renderVerdict(verdict: V): string;
  /** Called after each render so the page can wire up its own buttons. */
  onRender?(state: { index: number; verdict: V | null }): void;
  /** Where the panel lives. */
  box: HTMLElement;
  dots?: HTMLElement | null;
  /**
   * Keep answers in the URL hash, so a result can be linked and the browser
   * back button steps through questions instead of leaving the page.
   */
  syncHash?: boolean;
};

export function createQuiz<V>(o: QuizOptions<V>) {
  const { questions, box, dots, syncHash = false } = o;
  let picked: number[] = [];

  const readHash = (): number[] => {
    if (!syncHash) return [];
    const m = location.hash.match(/a=([\d,]*)/);
    if (!m?.[1]) return [];
    return m[1]
      .split(',')
      .filter(Boolean)
      .map(Number)
      .filter((n, i) => Number.isInteger(n) && n >= 0 && n < (questions[i]?.options.length ?? 0))
      .slice(0, questions.length);
  };

  const writeHash = (next: number[], push: boolean) => {
    if (!syncHash) return;
    const url = next.length ? `#a=${next.join(',')}` : location.pathname;
    history[push ? 'pushState' : 'replaceState']({ a: next }, '', url);
  };

  const setDots = (i: number) =>
    dots?.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k <= i));

  /** Focus follows the content, or a screen reader user loses their place. */
  const focusHead = () => (box.querySelector('[data-quiz-head]') as HTMLElement | null)?.focus();

  function render() {
    const at = picked.length;

    if (at < questions.length) {
      setDots(at);
      box.innerHTML = o.renderQuestion(questions[at], at, questions.length);

      box.querySelectorAll<HTMLButtonElement>('[data-quiz-opt]').forEach((b) =>
        b.addEventListener('click', () => {
          picked = [...picked, Number(b.dataset.quizOpt)];
          writeHash(picked, true);
          render();
        })
      );
      box.querySelector('[data-quiz-back]')?.addEventListener('click', () => {
        if (syncHash) history.back();
        else {
          picked = picked.slice(0, -1);
          render();
        }
      });

      if (at > 0) focusHead();
      o.onRender?.({ index: at, verdict: null });
      return;
    }

    setDots(questions.length);
    const verdict = o.resolve(picked.map((choice, i) => questions[i].options[choice]));
    box.innerHTML = o.renderVerdict(verdict);
    box.querySelector('[data-quiz-restart]')?.addEventListener('click', () => {
      picked = [];
      writeHash(picked, true);
      render();
    });
    focusHead();
    o.onRender?.({ index: questions.length, verdict });
  }

  if (syncHash) {
    addEventListener('popstate', () => {
      picked = readHash();
      render();
    });
    picked = readHash();
    writeHash(picked, false);
  }

  render();
  return { restart: () => { picked = []; writeHash(picked, false); render(); } };
}
