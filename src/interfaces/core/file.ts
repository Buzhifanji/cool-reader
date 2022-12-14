export interface KookitRenderParams {
  content: Uint8Array;
  renderName: string;
  renderMode?: string;
  isSliding?: boolean
}

export interface KookitChapter {
  label: string;
  id: string;
  href: string;
  subitems: KookitChapter[],
}