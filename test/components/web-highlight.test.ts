import { WebHighlight } from "src/core/web-highlight";
import { DATA_WEB_HIGHLIGHT, DATA_WEB_HIGHLIGHT_EXTRA, getDefaultOptions, ID_DIVIDION } from "src/core/web-highlight/constant";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, test, beforeEach } from "vitest";
import jsdomGlobal from 'jsdom-global';

let webHighlight: WebHighlight;
let cleanup;

beforeEach(async () => {
  const html = await readFileSync(resolve(__dirname, 'fixtures', 'web-highlight.html'), 'utf-8');
  cleanup = jsdomGlobal(html);
  document.body.innerHTML = html;
  webHighlight = new WebHighlight({});
})

const options = getDefaultOptions()

const selectAll = (tagName = 'p') => document.querySelectorAll<HTMLElement>(tagName);
const select = (tagName: string) => document.querySelector<HTMLElement>(tagName);


const getWrapById = (id: string) => `${options.tagName}[${DATA_WEB_HIGHLIGHT}='${id}']`
const getWrapByExtraId = (id: string) => `${options.tagName}[${DATA_WEB_HIGHLIGHT_EXTRA}='${id}']`

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

  return range
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
    const range = createRange(node, node, 0, 20);

    const { source } = webHighlight.fromRange(range);
    expect(source).not.toBeNull();
    const id = source.id
    webHighlight.paint(id)

    const wrapper = selectAllById(id)[0]

    expect(webHighlight.getSource(id)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(range.toString())
  })

  test('split right correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]

    // first
    const node = p.childNodes[0]
    const range1 = createRange(node, node, 5, 15);
    const source1 = webHighlight.fromRange(range1).source;
    expect(source1).not.toBeNull();
    const id1 = source1.id

    webHighlight.paint(id1)
    const wrapper = selectAllById(id1)[0]

    expect(webHighlight.getSource(id1)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(range1.toString())

    expect(p.childNodes[1]).toEqual(wrapper)
    expect(p.childNodes.length).toEqual(3)

    // second
    const range2 = createRange(wrapper.childNodes[0], wrapper.nextSibling, 5, 5);
    const source2 = webHighlight.fromRange(range2).source;
    expect(source2).not.toBeNull();
    const id2 = source2.id

    webHighlight.paint(id2)
    const wrapper2 = selectAllById(id2)
    expect(wrapper2[0].textContent + wrapper2[1].textContent).toEqual(range2.toString())

    // extra
    const extraId = wrapper2[0].getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(extraId).not.toBeNull()
    expect(webHighlight.getSource(extraId)).not.toBeUndefined()

    const prevWrap = selectAllById(extraId, true)[0]

    expect(prevWrap.textContent).toEqual(range1.toString().substring(5, 10))

    const list = p.querySelectorAll(options.tagName)
    expect(list.length).toEqual(3)
  })

  test.todo('split left correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]

    // first
    const node = p.childNodes[0]
    const content1 = createRange(node, node, 5, 15);
    const id1 = webHighlight.range();
    expect(id1).not.toBeNull();

    webHighlight.paint(id1)
    const wrapper = selectAllById(id1)[0]

    expect(webHighlight.getSource(id1)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(content1)

    expect(p.childNodes[1]).toEqual(wrapper)
    expect(p.childNodes.length).toEqual(3)

    // second
    const content2 = createRange(wrapper.previousSibling, wrapper.childNodes[0], 2, 5);
    const id2 = webHighlight.range();
    expect(id2).not.toBeNull();

    webHighlight.paint(id2)
    const wrapper2 = selectAllById(id2)
    expect(wrapper2[0].textContent + wrapper2[1].textContent).toEqual(content2)

    // extra
    const extraId = wrapper2[1].getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(extraId).not.toBeNull()
    expect(webHighlight.getSource(extraId)).not.toBeUndefined()

    const prevWrap = selectAllById(extraId, true)[0]
    expect(prevWrap.textContent).toEqual(content1.substring(0, 5))

    const list = p.querySelectorAll(options.tagName)
    expect(list.length).toEqual(3)
  })

  test.todo('split center correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]

    const node = p.childNodes[0]
    const content1 = createRange(node, node, 5, 15);
    const id1 = webHighlight.range();
    expect(id1).not.toBeNull();

    webHighlight.paint(id1)
    const wrapper = selectAllById(id1)[0]

    expect(webHighlight.getSource(id1)).not.toBeUndefined()
    expect(wrapper.textContent).toEqual(content1)

    expect(p.childNodes[1]).toEqual(wrapper)
    expect(p.childNodes.length).toEqual(3)

    const node2 = wrapper.childNodes[0]
    const content2 = createRange(node2, node2, 2, 7);
    const id2 = webHighlight.range();
    expect(id2).not.toBeNull();

    webHighlight.paint(id2)
    const wrapper2 = selectAllById(id2)
    expect(wrapper2.length).toEqual(1)

    // extra
    const extraId = wrapper2[0].getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(extraId).not.toBeNull()
    expect(webHighlight.getSource(extraId)).not.toBeUndefined()

    const prevWrap = selectAllById(extraId)
    expect(prevWrap.length).toEqual(2)
    expect(prevWrap[0].textContent + prevWrap[1].textContent).toEqual(content1.replace(content2, ''))
  })
  test.todo('split overflow correctly when the new selection is inside an exist selection', () => {
    const p = selectAll()[0]
    const startOffset = 0;
    const endOffset = 17;

    const node = p.childNodes[0]
    const content1 = createRange(node, node, startOffset, endOffset);
    const id1 = webHighlight.range();
    webHighlight.paint(id1)
    const wrapper1 = selectAllById(id1)[0]

    const node2 = wrapper1.childNodes[0]
    const content2 = createRange(node2, node2, startOffset, endOffset)
    const id2 = webHighlight.range();
    webHighlight.paint(id2)

    const wrapper2 = selectAllById(id2)[0]

    const extraId = wrapper2.getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)
    expect(content1).toEqual(content2)
    expect(extraId).toEqual(id1)

    const node3 = wrapper2.childNodes[0]
    const content3 = createRange(node3, node3, startOffset, endOffset)
    const id3 = webHighlight.range()
    webHighlight.paint(id3)

    const wrapper3 = selectAllById(id3)[0]
    const extraId3 = wrapper3.getAttribute(DATA_WEB_HIGHLIGHT_EXTRA)

    expect(content3).toEqual(content2)
    expect(extraId3).toEqual(id1 + ID_DIVIDION + id2)
  })
  test.todo('cut multiple lines', () => {
    const ps = selectAll();
    const start = ps[0].childNodes;
    const end = ps[1].childNodes;
    expect(start.length).toEqual(1)
    expect(end.length).toEqual(3)

    const content = createRange(start[0], end[2], 0, end[2].textContent.length)
    const id = webHighlight.range()
    webHighlight.paint(id);

    const wrapper = selectAllById(id)

    expect(wrapper.length).toEqual(4)
    expect(ps[0].children[0]).toEqual(wrapper[0])
    expect(ps[1].children[1].children[0]).toEqual(wrapper[2])
  })
})

afterEach(() => {
  cleanup()
})
