import { defineField, defineType } from 'sanity';

export const imageMetaSchema = defineType({
  name: 'sanity.imageAsset',
  type: 'document',
  fields: [
    defineField({
      name: 'articleNumber',
      title: 'Article Number',
      type: 'number',
      description: 'The article number this image belongs to',
    }),
  ],
});
