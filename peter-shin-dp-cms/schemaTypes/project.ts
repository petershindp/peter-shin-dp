import {defineField, defineType} from 'sanity'
import {MdWork as icon} from 'react-icons/md'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'stills',
      title: 'Stills',
      type: 'array',
      of: [{type: 'image'}], // Array of images
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
