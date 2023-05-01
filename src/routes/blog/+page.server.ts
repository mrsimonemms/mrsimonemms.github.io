import type { PageServerLoad } from './$types';
import { listPosts } from '$lib/blog';

export const load: PageServerLoad = async () => {
  return {
    posts: listPosts(),
  };
};
