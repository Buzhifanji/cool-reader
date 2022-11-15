import { WebHighlight } from "@/core/web-highlight";
import { readFileSync } from 'fs';
import { resolve } from 'path';

let webHighlight: WebHighlight;

beforeEach(async () => {
  const html = await readFileSync(resolve(__dirname, 'fixtures', 'web-highlight.html'), 'utf-8');
  document.body.innerHTML = html;
  webHighlight = new WebHighlight({});
})

const selectAll = (tagName: string) => document.querySelectorAll(tagName);

describe('web-highlight', () => {
  test('do not create id', () => {
    const main = document.querySelector('main')
    main.addEventListener('click', () => {
      const id = webHighlight.range();
      expect(id).toBeNull();
    })

    main.click();
  })
})
