export class Line {
  
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  lineWidth: number;

  constructor(x1?: number, x2?: number, y1?: number, y2?: number, lineWidth?: number) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.lineWidth = lineWidth ? lineWidth : 1;
  }

  draw(context: CanvasRenderingContext2D): void {
    context.beginPath();
    context.moveTo(this.x1, this.y1);
    context.lineTo(this.x2, this.y2);
    context.lineWidth = this.lineWidth;
    context.stroke();
  }
}
