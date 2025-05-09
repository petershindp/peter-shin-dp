import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: 'your_project_id', // Replace with your actual Sanity project ID
  dataset: 'production',
  useCdn: true,
});