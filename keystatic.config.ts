import { config, collection, fields } from '@keystatic/core';

/**
 * Visual editor for the site's content, at /keystatic.
 *
 * Runs locally against the working directory: no database, no service, no
 * account. Everything it writes is the same markdown and YAML the build reads,
 * so a change made here is a normal git diff.
 *
 * It exists because publishing required creating a file, getting frontmatter
 * right and making a commit — and the whole strategy depends on publishing
 * regularly. Friction there quietly becomes a lower publishing rate.
 */
export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'sgualda.com' },
    navigation: {
      Writing: ['essays'],
      Work: ['cases'],
      'Free checks': ['tools'],
      'The map': ['stages'],
    },
  },

  collections: {
    essays: collection({
      label: 'Essays',
      path: 'src/content/essays/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'URL slug',
            description: 'This becomes the address. Changing it breaks a live link.',
          },
        }),
        description: fields.text({
          label: 'Meta description',
          description: 'What Google shows underneath the title. Between 70 and 160 characters.',
          validation: { length: { min: 70, max: 160 }, isRequired: true },
          multiline: true,
        }),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        updated: fields.date({ label: 'Updated' }),
        topics: fields.multiselect({
          label: 'Topics',
          description: 'Drives the topic hubs, the related essays and the cross-links.',
          options: [
            { label: 'Discovery', value: 'discovery' },
            { label: 'Scope', value: 'scope' },
            { label: 'Launch', value: 'launch' },
            { label: 'Measurement', value: 'measurement' },
            { label: 'Process', value: 'process' },
            { label: 'Craft', value: 'craft' },
          ],
        }),
        seoTitle: fields.text({
          label: 'Short title for search',
          description: 'Only needed when the title runs past about 70 characters.',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        migrated: fields.checkbox({ label: 'Migrated from WordPress', defaultValue: false }),
        body: fields.markdoc({ label: 'Essay' }),
      },
    }),

    cases: collection({
      label: 'Case studies',
      path: 'src/content/cases/*',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        description: fields.text({
          label: 'Meta description',
          validation: { length: { min: 70, max: 160 }, isRequired: true },
          multiline: true,
        }),
        summary: fields.text({ label: 'One-line summary', validation: { isRequired: true } }),
        client: fields.text({ label: 'Where', description: 'Company, or "my own company".' }),
        role: fields.text({ label: 'Role' }),
        year: fields.text({ label: 'When' }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Alive', value: 'alive' },
            { label: 'Shipped', value: 'shipped' },
            { label: 'In progress', value: 'in-progress' },
            { label: 'Buried', value: 'buried' },
          ],
          defaultValue: 'in-progress',
        }),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        order: fields.integer({ label: 'Order', defaultValue: 99 }),
        cover: fields.image({
          label: 'Cover',
          directory: 'src/assets/cases',
          publicPath: '../../assets/cases/',
        }),
        coverAlt: fields.text({
          label: 'Cover alt text',
          description: 'What the image shows. Not optional — a screen reader reads this.',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        migrated: fields.checkbox({ label: 'Migrated', defaultValue: false }),
        body: fields.markdoc({ label: 'The case study' }),
      },
    }),

    tools: collection({
      label: 'Free checks',
      path: 'src/content/tools/*',
      slugField: 'n',
      format: { data: 'yaml' },
      schema: {
        n: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        cat: fields.select({
          label: 'Category',
          options: [
            { label: 'Launch & growth', value: 'growth' },
            { label: 'Users & feedback', value: 'users' },
            { label: 'Decisions', value: 'decisions' },
            { label: 'Team & process', value: 'team' },
          ],
          defaultValue: 'growth',
        }),
        time: fields.text({ label: 'Takes', description: 'e.g. 40 seconds' }),
        count: fields.text({ label: 'Length', description: 'e.g. 3 questions' }),
        title: fields.text({ label: 'Page title for search' }),
        meta: fields.text({ label: 'Meta description', multiline: true }),
        lead: fields.text({ label: 'Intro', multiline: true }),
        out: fields.text({ label: 'What you get', multiline: true }),
        answers: fields.array(
          fields.object({
            name: fields.text({ label: 'Answer' }),
            note: fields.text({ label: 'One line', multiline: true }),
          }),
          { label: 'Possible answers', itemLabel: (i) => i.fields.name.value }
        ),
        q: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            options: fields.array(
              fields.object({
                label: fields.text({ label: 'Option' }),
                score: fields.integer({ label: 'Score', defaultValue: 0 }),
              }),
              { label: 'Options', itemLabel: (i) => i.fields.label.value }
            ),
          }),
          { label: 'Questions', itemLabel: (i) => i.fields.question.value }
        ),
        b: fields.array(
          fields.object({
            max: fields.integer({ label: 'Up to score' }),
            name: fields.text({ label: 'Verdict' }),
            sub: fields.text({ label: 'Subtitle', multiline: true }),
            body: fields.text({ label: 'Reasoning (HTML)', multiline: true }),
            next: fields.array(fields.text({ label: 'Step' }), { label: 'What I would do next' }),
          }),
          { label: 'Outcomes', itemLabel: (i) => i.fields.name.value }
        ),
        faqs: fields.array(
          fields.object({
            q: fields.text({ label: 'Question' }),
            a: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'FAQs', itemLabel: (i) => i.fields.q.value }
        ),
      },
    }),

    stages: collection({
      label: 'Map stages',
      path: 'src/content/stages/*',
      slugField: 'name',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        n: fields.text({ label: 'Number', description: '01 to 05' }),
        lead: fields.text({ label: 'One line', multiline: true }),
        question: fields.text({ label: 'Central question' }),
        x: fields.integer({ label: 'X on the diagram (%)' }),
        y: fields.integer({ label: 'Y on the diagram (%)' }),
        tools: fields.array(fields.text({ label: 'Check slug' }), { label: 'Checks that apply' }),
        body: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'What this stage is',
        }),
        traps: fields.array(fields.text({ label: 'Trap', multiline: true }), {
          label: 'Where it goes wrong',
        }),
        signal: fields.text({ label: 'You are past it when', multiline: true }),
        cta: fields.object({
          title: fields.text({ label: 'Offer' }),
          body: fields.text({ label: 'Description', multiline: true }),
        }),
      },
    }),
  },
});
