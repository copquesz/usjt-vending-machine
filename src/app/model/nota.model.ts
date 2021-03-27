export class Nota {

  public id: number;
  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public value: number;
  public image: HTMLImageElement;

  constructor(x?: number, y?: number, w?: number, h?: number, value?: number, src?: string) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.value = value;
    this.image = new Image();
    this.image.src = src;
  }

  draw(context: CanvasRenderingContext2D) {
    this.image.onload = () => context.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}
