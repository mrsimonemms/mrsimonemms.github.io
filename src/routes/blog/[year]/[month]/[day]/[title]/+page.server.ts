import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { parsePost } from '$lib/blog';

export const load: PageServerLoad = async ({ params }) => {
  const post = parsePost(
    `src/blog/${params.year}-${params.month}-${params.day}-${params.title}.md`,
  );

  if (post !== null) {
    return post;
  }

  throw error(404, 'Page not found');
};
