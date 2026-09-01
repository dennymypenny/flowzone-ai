/**
 * Client words, verbatim, or nothing.
 *
 * This list starts empty and the section renders nothing until a real client
 * says a real thing. No placeholders, no samples, no "coming soon". Add an
 * entry only when the person said it and agreed to be named.
 */

export type Testimonial = {
  quote: string;
  name: string;
  business: string;
  url?: string;
};

export const TESTIMONIALS: Testimonial[] = [];
