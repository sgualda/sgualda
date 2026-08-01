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
export function rehypeTableScroll() {
  return (tree: Root) => {
    const walk = (node: Root | Element) => {
      if (!('children' in node) || !node.children) return;
      node.children = node.children.map((child) => {
        if (child.type === 'element') walk(child);
        if (child.type !== 'element' || child.tagName !== 'table') return child;
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
