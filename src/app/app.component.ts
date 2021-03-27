import { Nota } from './model/nota.model';
import { Text } from './model/text.model';
import { React } from './model/react.model';
import { Component, ElementRef, AfterViewInit , ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'Candy Machine';

  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;

  nota1Real: Nota;
  nota2Reais: Nota;
  nota5Reais: Nota;
  nota10Reais: Nota;

  okButton: React;
  resetButton: React;

  total: number = 0;

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.canvas.width = 800;
    this.context.canvas.height = 600;
    this.context.lineWidth = 1;
    this.init();
  }

  init() {
    this.draw();
    this.onClick();
  }

  draw() {
    this.drawNotas();
    this.drawTotal();
    this.drawMenu();
    this.drawResetButton();
    this.drawOkButton();
  }

  redraw(){
    this.clear();
    this.draw();
  }

  onClick(){
    var el = this.canvas.nativeElement;
    el.addEventListener('click', event => {

      var x = event.offsetX;
      var y = event.offsetY;

      // Ao clicar na nota de 1 real
      if(x >= this.nota1Real.x && (x <= this.nota1Real.x + this.nota1Real.w) && y >= this.nota1Real.y && (y <= this.nota1Real.y + this.nota1Real.h)){
        this.total += this.nota1Real.value;
        this.redraw();
      }

      // Ao clicar na nota de 2 reais
      if(x >= this.nota2Reais.x && (x <= this.nota2Reais.x + this.nota2Reais.w) && y >= this.nota2Reais.y && (y <= this.nota2Reais.y + this.nota2Reais.h)){
        this.total += this.nota2Reais.value;
        this.redraw();
      }

      // Ao clicar na nota de 5 reais
      if(x >= this.nota5Reais.x && (x <= this.nota5Reais.x + this.nota5Reais.w) && y >= this.nota5Reais.y && (y <= this.nota5Reais.y + this.nota5Reais.h)){
        this.total += this.nota5Reais.value;
        this.redraw();
      }

      // Ao clicar na nota de 10 reais
      if(x >= this.nota10Reais.x && (x <= this.nota10Reais.x + this.nota10Reais.w) && y >= this.nota10Reais.y && (y <= this.nota10Reais.y + this.nota10Reais.h)){
        this.total += this.nota10Reais.value;
        this.redraw();
      }

      // Ao clicar no botão 'OK'
      if(x >= this.okButton.x && (x <= this.okButton.x + this.okButton.w) && y >= this.okButton.y && (y <= this.okButton.y + this.okButton.h)){
        alert('OK CLICADO');
      }

      // Ao clicar no botão 'RESET'
      if(x >= this.resetButton.x && (x <= this.resetButton.x + this.resetButton.w) && y >= this.resetButton.y && (y <= this.resetButton.y + this.resetButton.h)){
        this.reset();
        this.redraw();
      }

    });
  }

  drawNotas(){
    this.nota1Real = new Nota(450, 10, 150, 60, 1, './../assets/images/notas/1-real.jpg')
    this.nota1Real.draw(this.context);

    this.nota2Reais = new Nota(620, 10, 150, 60, 2, './../assets/images/notas/2-reais.jpg')
    this.nota2Reais.draw(this.context);

    this.nota5Reais = new Nota(450, 100, 150, 60, 5, './../assets/images/notas/5-reais.jpg')
    this.nota5Reais.draw(this.context);

    this.nota10Reais = new Nota(620, 100, 150, 60, 10, './../assets/images/notas/10-reais.jpg')
    this.nota10Reais.draw(this.context);
  }

  drawTotal(){
    const reac = new React(450, 180, 320, 60).draw(this.context);
    const text = new Text(`Valor Total: R$ ${this.total},00`, 460, 220, null, '26px').draw(this.context);
  }

  drawMenu(){
    const reac = new React(450, 260, 320, 270).draw(this.context);
  }

  drawResetButton(){
    this.resetButton = new React(590, 550, 100, 40);
    this.resetButton.draw(this.context);
    const text = new Text(`RESET`, 610, 550+27, null, '18px').draw(this.context);
  }

  drawOkButton(){
    this.okButton = new React(720, 550, 50, 40);
    this.okButton.draw(this.context);
    const text = new Text(`OK`, 730, 550+27, null, '18px').draw(this.context);
  }

  reset(){
    this.total = 0;
  }

  clear(){
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }


}
