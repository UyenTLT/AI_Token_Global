import { defineType } from 'sanity';

export const faqItemSchema = defineType({
  name: 'faqItem',
  type: 'object',
  title: 'FAQ Item',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
  preview: {
    select: { title: 'question' },
  },
});
