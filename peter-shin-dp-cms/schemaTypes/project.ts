import {defineField, defineType} from 'sanity'
import {MdWork as icon} from 'react-icons/md'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'projectId',
      title: 'Project ID',
      type: 'string',
      description: 'Unique identifier for the project, used for linking',
      validation: (Rule) => Rule.required().min(1).max(50),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      options: {
        list: [
          {title: 'Commercial', value: 'Commercial'},
          {title: 'Music Video', value: 'Music Video'},
          {title: 'Short Film', value: 'Short Film'},
          {title: 'Documentary', value: 'Documentary'},
          {title: 'Brand Film', value: 'Brand Film'},
          {title: 'Social Content', value: 'Social Content'},
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
    }),
    defineField({
      name: 'videoFile',
      title: 'Video File',
      type: 'file',
      options: {
        accept: 'video/*', // Restrict uploads to video files only
      },
    }),
    defineField({
      name: 'videoLink',
      title: 'Video Link',
      type: 'url', // Field for embedding a video via a URL
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: {
        hotspot: true, // Enable image cropping
      },
    }),
    defineField({
      name: 'clips',
      title: 'Clips',
      type: 'array',
      of: [{type: 'file', options: {accept: 'video/*'}}],
      description: 'Short video clips shown in the project carousel',
    }),
    defineField({
      name: 'stills',
      title: 'Stills',
      type: 'array',
      of: [{type: 'image'}],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls the order of items in the grid',
    }),
    defineField({
      name: 'hide',
      title: 'Hide',
      type: 'boolean',
      description: 'Hide this project from the main page',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
    },
  },
})
