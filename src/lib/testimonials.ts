/**
 * What other people say. The only third-party evidence on the site, which is
 * why it earns a place above the fold rather than a section near the footer.
 *
 * TODO(sergio): three of these carry an initial rather than a surname, and
 * none links to a profile. A reader assumes an unverifiable testimonial was
 * written by the site owner — which is exactly the doubt this section exists
 * to remove. Ask the three of them for permission to use full name, role,
 * company and a link. See #Q-097.
 */
export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  company?: string;
  url?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'I’ve loved working with Sergio! He is a skilled product designer with a particular talent for interaction design: the solutions he comes up with are fun, practical and scalable.',
    name: 'Lou D.',
  },
  {
    quote:
      'Sergio was very easy to work with, being a good communicator and always delivering what he promised. He took a very pro-active role and worked hard to find ways round the various obstacles we came up against.',
    name: 'Amjad Butt',
  },
  {
    quote:
      'He’s been a huge advocate for usability and accessibility standards, and is impressively eager for feedback to always continue to grow and improve.',
    name: 'Fermin M.',
  },
];
