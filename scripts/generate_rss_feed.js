import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import xml from 'xml';
import { fileURLToPath } from 'url';
import * as blog from '../src/lib/blog.js';
import pkg from '../package.json' with { type: 'json' };

const domain = process.env.PUBLIC_DOMAIN_NAME;
const feedName = 'rss.xml';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

function buildFeed(posts) {
  const sortedPosts = posts.sort(
    (first, second) =>
      new Date(second.attributes.date).getTime() - new Date(first.attributes.date).getTime(),
  );

  return sortedPosts.map((post) => ({
    item: [
      { title: post.attributes.title },
      { pubDate: post.attributes.date.toUTCString() },
      { link: `${domain}${post.route}` },
      { guid: [{ _attr: { isPermaLink: true } }, `${domain}${post.route}`] },
      ...post.attributes.tags.reduce((result, tag) => {
        const category = tag.trim();
        if (category !== '') {
          result.push({
            category,
          });
        }
        return result;
      }, []),
      {
        description: {
          _cdata: marked(
            `![${post.attributes.title}](${post.attributes.image})

${post.body}`,
            {
              baseUrl: domain,
              gfm: true,
            },
          ),
        },
      },
    ],
  }));
}

async function generateRssFeed() {
  const posts = await blog.listPosts();

  const feedObject = {
    rss: [
      {
        _attr: {
          version: '2.0',
          'xmlns:atom': 'http://www.w3.org/2005/Atom',
        },
      },
      {
        channel: [
          {
            'atom:link': {
              _attr: {
                href: `${domain}/${feedName}`,
                rel: 'self',
                type: 'application/rss+xml',
              },
            },
          },
          { title: 'Simon Emms' },
          { link: domain },
          { description: pkg.description },
          { lastBuildDate: new Date().toUTCString() },
          { language: 'en-GB' },
          ...buildFeed(posts),
        ],
      },
    ],
  };

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/styles/rss.xsl"?>
${xml(feedObject, true)}`;

  const filePath = path.join(__dirname, '..', 'static', feedName);
  await fs.writeFile(filePath, feed);
  return filePath;
}

(async () => {
  try {
    const filePath = await generateRssFeed();

    console.log(`Feed generated and written to ${filePath}`);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
})();
