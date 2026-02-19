import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { remarkSpoiler } from '../src/plugins/remark-spoiler.js';

const processor = unified()
  .use(remarkParse)
  .use(remarkSpoiler)
  .use(remarkStringify);

const markdown = `
||![](../assets/images/gal-3.png)||
`;

const result = processor.processSync(markdown);

console.log('Processed Markdown:', result.toString());

// Also inspect AST
const tree = processor.parse(markdown);
remarkSpoiler()(tree);
console.log('AST Structure for Paragraph:', JSON.stringify(tree.children[0], null, 2));
