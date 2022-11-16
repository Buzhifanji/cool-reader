import { WebHighlight } from "@/core/web-highlight";
import { DATA_WEB_HIGHLIGHT, DATA_WEB_HIGHLIGHT_EXTRA, getDefaultOptions } from "@/core/web-highlight/constant";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, test, beforeEach } from "vitest";

let webHighlight: WebHighlight;

beforeEach(async () => {
  const html = await readFileSync(resolve(__dirname, 'fixtures', 'web-highlight.html'), 'utf-8');
  document.body.innerHTML = html;
  webHighlight = new WebHighlight({});
})

const options = getDefaultOptions()

const selectAll = (tagName = 'p') => document.querySelectorAll<HTMLElement>(tagName);
const select = (tagName: string, root: Document | HTMLElement = document) => root.querySelector<HTMLElement>(tagName);


const getWrapById = (id: string) => `${options.tagName}[${DATA_WEB_HIGHLIGHT}=${id}]`
const getWrapByExtraId = (id: string) => `${options.tagName}[${DATA_WEB_HIGHLIGHT_EXTRA}=${id}]`

const selectAllById = (id: string, isExtra = false) => {
  const wrapSelector = isExtra ? getWrapByExtraId(id) : getWrapById(id)
  return selectAll(wrapSelector)
}


const createRange = (strartNode: Node, endNode: Node, start: number, end: number) => {
  window.getSelection().removeAllRanges();

  const range = document.createRange();
  range.setStart(strartNode, start);
  range.setEnd(endNode, end);

  window.getSelection().addRange(range);

  return range.toString()
}

describe('web-highlight', () => {

  test('should wrap nothing when selection is not isCollapsed', () => {
    const main = select('main')
    main.addEventListener('click', () => {
      const id = webHighlight.range();
      expect(id).toBeNull();
    })

    main.click();
  })

  test('should create new wrap', () => {
    const p = selectAll()[0]
    const node = p.childNodes[0]
    const content = createRange(node, node, 0, 20);

    const id = webHighlight.range() as string;
    expect(id).not.toBeNull();

    webHighlight.paint(id)

    const wrapper = selectAllById(id)[0]

    expect(webHighlight.getSource(id)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(content)
  })

  test('split right correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]

    // first
    const node = p.childNodes[0]
    const content1 = createRange(node, node, 5, 15);
    const id1 = webHighlight.range() as string;
    expect(id1).not.toBeNull();

    webHighlight.paint(id1)
    const wrapper = selectAllById(id1)[0]


    expect(webHighlight.getSource(id1)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(content1)

    expect(p.childNodes[1]).toEqual(wrapper)
    expect(p.childNodes.length).toEqual(3)

    // second
    const content2 = createRange(wrapper.childNodes[0], wrapper.nextSibling, 5, 5);
    const id2 = webHighlight.range() as string;
    expect(id2).not.toBeNull();

    webHighlight.paint(id2)
    const wrapper2 = selectAllById(id2)
    expect(wrapper2[0].textContent + wrapper2[1].textContent).toEqual(content2)

    // extra
    const extraId = wrapper2[0].getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(extraId).not.toBeNull()
    expect(webHighlight.getSource(extraId)).not.toBeUndefined()

    const prevWrap = selectAllById(extraId, true)[0]

    expect(prevWrap.textContent).toEqual(content1.substring(5, 10))

    const list = p.querySelectorAll(options.tagName)
    expect(list.length).toEqual(3)
  })

  test('split left correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]

    // first
    const node = p.childNodes[0]
    const content1 = createRange(node, node, 5, 15);
    const id1 = webHighlight.range() as string;
    expect(id1).not.toBeNull();

    webHighlight.paint(id1)
    const wrapper = selectAllById(id1)[0]

    expect(webHighlight.getSource(id1)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(content1)

    expect(p.childNodes[1]).toEqual(wrapper)
    expect(p.childNodes.length).toEqual(3)

    // second
    const content2 = createRange(wrapper.previousSibling, wrapper.childNodes[0], 2, 5);
    const id2 = webHighlight.range() as string;
    expect(id2).not.toBeNull();

    webHighlight.paint(id2)
    const wrapper2 = selectAllById(id2)
    expect(wrapper2[0].textContent + wrapper2[1].textContent).toEqual(content2)

    // extra
    const extraId = wrapper2[1].getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(extraId).not.toBeNull()
    expect(webHighlight.getSource(extraId)).not.toBeUndefined()

    const prevWrap = selectAllById(extraId, true)[0]
    console.log(content1)
    expect(prevWrap.textContent).toEqual(content1.substring(0, 5))

    const list = p.querySelectorAll(options.tagName)
    expect(list.length).toEqual(3)
  })

  test.todo('split center correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]


  })
  test.todo('split center correctly when the new selection is inside an exist selection', () => {

  })
})
