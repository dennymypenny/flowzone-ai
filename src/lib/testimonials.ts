/**
 * Client words, verbatim, or nothing.
 *
 * The section renders nothing while this list is empty. No placeholders, no
 * samples, no "coming soon". Add an entry only when the person said it and
 * agreed to be named. Messages are copied from the actual text thread; the
 * only edit allowed is starring out a swear word.
 */

export type Testimonial = {
  /** The messages exactly as sent, in order. */
  messages: string[];
  /** Index of the message to highlight. */
  hot?: number;
  name: string;
  initials: string;
  business: string;
  url?: string;
  /** Time the messages came in, as shown on the phone. */
  time?: string;
  /** What we sent them, shown beside their reply. */
  image?: { src: string; alt: string; width: number; height: number };
};

export const TESTIMONIALS: Testimonial[] = [
  {
    messages: [
      "This looks f*cking sick",
      "I'm shook by this btw",
      "Looks f*cking crazy good",
    ],
    hot: 1,
    name: "Josh",
    initials: "JF",
    business: "Control Theory",
    time: "7:51 PM",
    image: {
      src: "/assets/control-theory-site.jpg",
      alt: "The Control Theory landing page on desktop and phone",
      width: 1800,
      height: 936,
    },
  },
];
