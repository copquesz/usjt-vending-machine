export class React {

  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public fillStyle: string;

  constructor(x?: number, y?: number, w?: number, h?: number, fillStyle?: string) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fillStyle ? fillStyle : 'black';
  }

  draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.fillStyle;
    context.strokeRect(this.x, this.y, this.w, this.h);
  }
}
