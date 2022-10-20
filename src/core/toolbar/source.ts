import { DATA_SOURCE_ID, DEFAULT_DOM_CLASS_NAME } from "@/constants";
import { DomSource, PaintSource } from "@/interfaces";
import { NotesModel } from "@/model";
import { getReadingBook, removeDomSource, saveDomSource } from "@/store";
import { isEndsWith, isNotes, selectorAll, stringTohash } from "@/utils";
import { getDomContianer, getPageNumber } from ".";
import { removePaint } from "./delete";
import { getMeteDom, setMeteDom } from "./dom";
import { paintWrap } from "./paint";

export function initDomSource(range: Range): DomSource | null {
  const contianer = getDomContianer();
  if (contianer) {
    const {
      startContainer: startDom,
      endContainer: endDom,
      startOffset,
      endOffset,
    } = range;

    const text = range.toString();
    const id = stringTohash(text);

    const notes = new NotesModel(
      id,
      getReadingBook().id,
      DEFAULT_DOM_CLASS_NAME,
      getPageNumber(),
      text,
      setMeteDom(contianer, startDom, startOffset),
      setMeteDom(contianer, endDom, endOffset)
    );

    return notes;
  }
  return null;
}

// 从 Range 对象中 创建 高亮笔记
export function domSourceFromRange(source: DomSource) {
  return paintSourceAction(source);
}

// 从 存储 数据中还原 高亮笔记
export function domSourceFromStore(source: DomSource | DomSource[]) {
  if (Array.isArray(source)) {
    source.forEach((item) => {
      domSourceFromStore(item);
    });
  } else {
    paintSourceAction(source);
  }
}

export function deleteDomSource(source: DomSource) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    removePaint(paintSource);
  }
}

export function updateDomSource(source: DomSource, className: string) {
  const paintSource = getPaintSource(source);
  if (paintSource) {
    const nodes = selectorAll(
      `.${className}[${DATA_SOURCE_ID}=${source.id}]`,
      paintSource.parentDom
    );
    nodes.forEach((node) => {
      node.className = source.className;
    });
  }
}

export function getPaintSource(source: DomSource): PaintSource | null {
  const contianer = getDomContianer();
  let result: PaintSource | null = null;
  if (contianer) {
    const startDom = getMeteDom(source, "startMeta", contianer);
    const endDom = getMeteDom(source, "endMeta", contianer);
    result = { parentDom: contianer, startDom, endDom, id: source.id };
  }
  return result;
}

/**
 * 为了处理，高亮和用户输入笔记 对应的内容相同的情况，此时id是一致，所以为了区分，需要额外处理id
 * @param source
 * @param paintSource
 */
function fomateId(source: DomSource, paintSource: PaintSource) {
  const id = source.id;
  const str = "_n";
  const updateId = (id: string) => {
    source.id = id;
    paintSource.id = id;
  };
  if (isNotes(source.className)) {
    if (!isEndsWith(id, str)) {
      updateId(id + str);
    }
  } else {
    if (isEndsWith(id, str)) {
      updateId(id.substring(0, id.length - 2));
    }
  }
}

function paintSourceAction(source: DomSource) {
  debugger;
  const paintSource = getPaintSource(source);
  if (paintSource && paintSource.startDom && paintSource.endDom) {
    fomateId(source, paintSource);
    const result = paintWrap(paintSource, source);
    if (result.result) {
      saveDomSource(source);
    } else {
      removeDomSource(source.id);
    }
    return result;
  }
  return { result: false, deleteIds: [] };
}
