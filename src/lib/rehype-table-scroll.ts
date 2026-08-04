import type { Root, Element } from 'hast';

/**
 * Wraps every markdown table in a horizontally scrollable region.
 *
 * A comparison table is the most useful thing you can put in an essay about
 * two competing ideas, and it is also the one element guaranteed not to fit on
 * a 280px phone. Without this the whole page scrolls sideways, which breaks
 * every other line of text on it.
 *
 * The wrapper carries tabindex and a label rather than just `overflow: auto`,
 * because a scrollable region that cannot be reached from the keyboard is a
 * region some people simply cannot read. `display: block` on the table itself
 * would have been one CSS line and would have stripped the table semantics
 * screen readers rely on.
 */
/**
 * Gives every cell a header a screen reader can find.
 *
 * Markdown has no way to say "this column is the row labels", so both
 * comparison tables on the site are written with an empty top-left cell and
 * the labels running down column one. Visually that reads perfectly. In the
 * markup those labels were plain `<td>`s sitting under an empty `<th>`, so
 * every cell in the table was announced with no row context at all — Lighthouse
 * flagged it and axe did not, because the rule sits outside the WCAG AA tags
 * the test suite scans for.
 *
 * Two changes: `scope="col"` on the header row, and the first cell of each body
 * row promoted to `<th scope="row">` when the top-left cell is blank, which is
 * exactly the shape that means "these are labels". Tables with a real
 * top-left heading are left alone.
 */
function fixHeaders(table: Element) {
  const rows: Element[] = [];
  const collect = (n: Element) => {
    for (const c of n.children ?? []) {
      if (c.type !== 'element') continue;
      if (c.tagName === 'tr') rows.push(c);
      else collect(c);
    }
  };
  collect(table);
  if (rows.length < 2) return;

  const cells = (r: Element) => r.children.filter((c): c is Element => c.type === 'element');
  const head = cells(rows[0]);
  if (!head.length || head[0].tagName !== 'th') return;

  for (const th of head) th.properties = { ...th.properties, scope: 'col' };

  // Only when the corner is empty. A table whose top-left cell says something
  // is a table where column one is data, not labels.
  const corner = JSON.stringify(head[0].children ?? []);
  if (/[A-Za-z0-9]/.test(corner)) return;

  for (const row of rows.slice(1)) {
    const first = cells(row)[0];
    if (!first || first.tagName !== 'td') continue;
    first.tagName = 'th';
    first.properties = { ...first.properties, scope: 'row' };
  }
}

export function rehypeTableScroll() {
  return (tree: Root) => {
    const walk = (node: Root | Element) => {
      if (!('children' in node) || !node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element') walk(child);
        if (child.type !== 'element' || child.tagName !== 'table') return child;
        fixHeaders(child);
        return {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-scroll'],
            tabindex: 0,
            role: 'region',
            'aria-label': 'Table, scrollable',
          },
          children: [child],
        } as Element;
      });
    };
    walk(tree);
  };
}
