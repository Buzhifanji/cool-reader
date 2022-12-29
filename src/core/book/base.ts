export abstract class BookBase {
  public abstract rendition: any;

  public abstract render(content: Uint8Array): Promise<any[]>
  public abstract up(): any
  public abstract down(): any
  public abstract catalogJump(value: any): Promise<unknown>
  public abstract pageJump(num: number): any
  public isRender() {
    if (!this.rendition) {
      throw new Error("you should render before used it");
    }
  }
}
