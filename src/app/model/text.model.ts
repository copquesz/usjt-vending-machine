export class Text {

  public text: string;
  public x: number;
  public y: number;
  public fontSize: string = '24px';
  public fillStyle: string;

  constructor(text?: string, x?: number, y?: number, fillStyle?: string, fontSize?: string) {
    this.text = text
    this.x = x;
    this.y = y;
    this.fillStyle ? fillStyle : 'black';
    this.fontSize = fontSize;
  }

  draw(context: CanvasRenderingContext2D): void {
    if (this.text && this.x && this.y) {
      context.fillStyle = this.fillStyle;
      context.font = `${this.fontSize} Comic Sans MS`;
      context.fillText(this.text, this.x, this.y);
    }
  }
}
