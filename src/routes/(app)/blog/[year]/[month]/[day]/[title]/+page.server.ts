import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';

import { parsePost, getNextAndPrev } from '$lib/blog';

export const load: PageServerLoad = async ({ params }) => {
  const post = parsePost(
    `src/blog/${params.year}-${params.month}-${params.day}-${params.title}.md`,
  );

  if (post !== null) {
    const domain = env.PUBLIC_DOMAIN_NAME;

    const { excerpt, image, title } = post.attributes;

    const metadata = new Map<string, App.MetaTags>([
      [
        'og:title',
        {
          property: 'og:title',
          content: title,
        },
      ],
      [
        'og:url',
        {
          property: 'og:url',
          content: `${domain}/blog/${params.year}/${params.month}/${params.day}/${params.title}`,
        },
      ],
      [
        'twitter:title',
        {
          name: 'twitter:title',
          content: title,
        },
      ],
    ]);

    if (excerpt) {
      metadata
        .set('description', {
          name: 'description',
          content: excerpt,
        })
        .set('og:description', {
          property: 'og:description',
          content: excerpt,
        })
        .set('twitter:description', {
          name: 'twitter:description',
          content: excerpt,
        });
    }

    if (image) {
      metadata
        .set('og:image', {
          property: 'og:image',
          content: `${domain}${image}`,
        })
        .set('twitter:image', {
          name: 'twitter:image',
          content: `${domain}${image}`,
        });
    }

    return {
      metadata,
      post,
      ...getNextAndPrev(post),
    };
  }

  throw error(404, 'Page not found');
};
