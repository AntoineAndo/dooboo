import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'translations',
  title: 'Translations',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'string',
    }),
    defineField({
      name: 'icu_locale',
      title: 'ICU Locale',
      type: 'string',
    }),
    defineField({
      name: 'default',
      title: 'Default',
      type: 'boolean',
    }),
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'code',
    }),
  ],
  preview: {
    select: {
      title: 'language',
      subtitle: 'code',
    },
  },
})
