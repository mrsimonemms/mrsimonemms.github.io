import { marked } from 'marked';
import hljs from 'highlight.js';
import terraformHljs from 'highlightjs-terraform';

export default function (content: string) {
  terraformHljs(hljs);

  return marked.parse(content, {
    gfm: true,
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  });
}
