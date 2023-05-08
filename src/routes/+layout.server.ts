import { env } from '$env/dynamic/public';
import pkg from '../../package.json' assert { type: 'json' };

const domainName = env.PUBLIC_DOMAIN_NAME;

export const load = () => {
  return {
    defaultMetadata: new Map<string, App.MetaTags>([
      [
        'description',
        {
          name: 'description',
          content: pkg.description ?? '',
        },
      ],
      [
        'og:title',
        {
          property: 'og:title',
          content: 'Software Engineer, Technical Leader, Solutions Designer',
        },
      ],
      [
        'og:site_name',
        {
          property: 'og:site_name',
          content: 'Simon Emms',
        },
      ],

      [
        'og:url',

        {
          property: 'og:url',
          content: domainName ?? '',
        },
      ],
      [
        'og:description',
        {
          property: 'og:description',
          content: process.env.npm_package_description || '',
        },
      ],
      [
        'og:type',
        {
          property: 'og:type',
          content: 'website',
        },
      ],
      [
        'og:image',
        {
          property: 'og:image',
          content: `${domainName}/img/face-and-hat-wide.jpg`,
        },
      ],
      [
        'twitter:card',
        {
          name: 'twitter:card',
          content: 'summary',
        },
      ],
      [
        'twitter:title',
        {
          name: 'twitter:title',
          content: 'Software Engineer, Technical Leader, Solutions Designer',
        },
      ],
      [
        'twitter:description',
        {
          name: 'twitter:description',
          content: pkg.description || '',
        },
      ],
      [
        'twitter:site',
        {
          name: 'twitter:site',
          content: `@${env.PUBLIC_TWITTER_USERNAME ?? 'todo'}`,
        },
      ],
      [
        'twitter:image',
        {
          name: 'twitter:image',
          content: `${domainName}/img/face-and-hat-wide.jpg`,
        },
      ],
      [
        'apple-mobile-web-app-title',
        {
          name: 'apple-mobile-web-app-title',
          content: 'SimonEmms.com',
        },
      ],
    ]),
  };
};
