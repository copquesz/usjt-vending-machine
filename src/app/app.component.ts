import { Product } from './model/product.model';
import { Stage } from './enum/stage.enum';
import { Button } from './model/button.model';
import { Note } from './model/note.model';
import { Text } from './model/text.model';
import { React } from './model/react.model';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  // Tittle
  title = 'Candy Machine';

  // Stage
  stage: Stage;

  // Canvas
  @ViewChild('canvas')
  canvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  canvasW: number = 480;
  canvasH: number = 600;

  // Notes
  noteOne: Note = new Note(480, 20, 100, 50, 1, './../assets/images/notas/1-real.jpg');
  noteTwo: Note = new Note(620, 20, 100, 50, 2, './../assets/images/notas/2-reais.jpg');
  noteFive: Note = new Note(480, 90, 100, 50, 5, './../assets/images/notas/5-reais.jpg');

  // Candys
  candyBullet = new Product(1, 70, 80, 80, 80, 6, './../assets/images/produtos/candy-1.png', new Text('#1', 150, 190, null, '16px', 'black'));
  candyBulletAvailable = false;
  candyBulletSelected = false;

  candyIceCream = new Product(2, 290, 80, 80, 80, 7, './../assets/images/produtos/candy-2.png', new Text('#4', 370, 190, null, '16px', 'black'));
  candyIceCreamAvailable = false;
  candyIceCreamSelected = false;

  candyLollipop = new Product(3, 60, 280, 80, 80, 8, './../assets/images/produtos/candy-3.png', new Text('#7', 150, 390, null, '16px', 'black'));
  candyLollipopAvailable = false;
  candyLollipopSelected = false;

  // Buttons
  okButton: Button;
  resetButton: Button;

  // Interval
  interval = null;

  // Utils
  totalInsert: number = 0;
  totalRequest: number = 0;
  transshipment: number = 0;
  itemSelected = null;

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.canvas.width = this.canvasW;
    this.context.canvas.height = this.canvasH;
    this.context.lineWidth = 1;
    this.init();
  }


  init() {
    this.stage = Stage.START;
    this.draw();
    this.onClick();
  }

  draw() {
    this.buildMachine();
    this.drawNotes();
    this.drawProducts();
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
      var changes = false;

      // Click Candys
      if(this.stage === Stage.SELECTING) {
        if(this.candyBulletAvailable && x >= this.candyBullet.x && (x <= this.candyBullet.x + this.candyBullet.w) && y >= this.candyBullet.y && (y <= this.candyBullet.y + this.candyBullet.h)){
          this.totalRequest = this.candyBullet.value;
          this.candyBulletSelected = true;
          this.stage = Stage.SELECTED;
          changes = true;
        }
        if(this.candyIceCreamAvailable && x >= this.candyIceCream.x && (x <= this.candyIceCream.x + this.candyIceCream.w) && y >= this.candyIceCream.y && (y <= this.candyIceCream.y + this.candyIceCream.h)){
          this.totalRequest = this.candyIceCream.value;
          this.candyIceCreamSelected = true;
          this.stage = Stage.SELECTED;
          changes = true;
        }
        if(this.candyLollipopAvailable && x >= this.candyLollipop.x && (x <= this.candyLollipop.x + this.candyLollipop.w) && y >= this.candyLollipop.y && (y <= this.candyLollipop.y + this.candyLollipop.h)){
          this.totalRequest = this.candyLollipop.value;
          this.candyLollipopSelected = true;
          this.stage = Stage.SELECTED;
          changes = true;
        }
        this.transshipment = this.totalInsert - this.totalRequest;
      }

      // Click Notes
      if(this.stage === Stage.INSERTING){
        if(x >= this.noteOne.x && (x <= this.noteOne.x + this.noteOne.w) && y >= this.noteOne.y && (y <= this.noteOne.y + this.noteOne.h)){
          this.totalInsert += this.noteOne.value;
          this.stage = Stage.INSERTING;
          changes = true;
        }

        if(x >= this.noteTwo.x && (x <= this.noteTwo.x + this.noteTwo.w) && y >= this.noteTwo.y && (y <= this.noteTwo.y + this.noteTwo.h)){
          this.totalInsert += this.noteTwo.value;
          this.stage = Stage.INSERTING;
          changes = true;
        }

        if(x >= this.noteFive.x && (x <= this.noteFive.x + this.noteFive.w) && y >= this.noteFive.y && (y <= this.noteFive.y + this.noteFive.h)){
          this.totalInsert += this.noteFive.value;
          this.stage = Stage.INSERTING;
          changes = true;
        }

        // Verify available candy
        if(this.totalInsert >= this.candyBullet.value) this.candyBulletAvailable = true;
        if(this.totalInsert >= this.candyIceCream.value) this.candyIceCreamAvailable = true;
        if(this.totalInsert >= this.candyLollipop.value) this.candyLollipopAvailable = true;

      }

      // Click OK Button
      if(x >= this.okButton.react.x && (x <= this.okButton.react.x + this.okButton.react.w) && y >= this.okButton.react.y && (y <= this.okButton.react.y + this.okButton.react.h)){
        switch(this.stage) {
          case Stage.START: { this.stage = Stage.INSERTING; break; }
          case Stage.INSERTING: { this.stage = Stage.SELECTING; break; }
        }
        changes = true;
      }

      // Click Reset Button
      if(x >= this.resetButton.react.x && (x <= this.resetButton.react.x + this.resetButton.react.w) && y >= this.resetButton.react.y && (y <= this.resetButton.react.y + this.resetButton.react.h)){
        this.reset();
        changes = true;
      }

      // Verify changes to redraw()
      if (changes) this.redraw();

    });
  }

  updatePainel(){
    switch(this.stage){
      case Stage.START: {
        new Text('Iniciar', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '18px', 'white').draw(this.context);
        new Text('Clique OK', (this.canvasW * 0.65), (this.canvasW * 0.80), null, '18px', 'white').draw(this.context);
        break;
      }
      case Stage.INSERTING: {
        new Text('Valor Inserido:', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '18px', 'white').draw(this.context);
        new Text(`R$ ${this.totalInsert},00`, (this.canvasW * 0.65), (this.canvasW * 0.80), null, '14px', 'white').draw(this.context);
        break;
      }
      case Stage.SELECTING: {
        const available = this.candyBulletAvailable || this.candyIceCreamAvailable || this.candyLollipopAvailable;
        if(!available){
          new Text('Saldo insuficiente', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '14px', 'white').draw(this.context);
          this.stage = Stage.FINAL;
          this.interval = setInterval( ()=> {
            this.redraw();
            clearInterval(this.interval);
          }, 2000);
        }
        else {
          new Text('Selecione o', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '14px', 'white').draw(this.context);
          new Text(`Produto disponível`, (this.canvasW * 0.65), (this.canvasW * 0.80), null, '14px', 'white').draw(this.context);
        }
        break;
      }
      case Stage.SELECTED: {
        new Text('Selecionado', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '14px', 'white').draw(this.context);
        if (this.candyBulletSelected) this.itemSelected = 'Bala';
        if (this.candyIceCreamSelected) this.itemSelected = 'Sorvete';
        if (this.candyLollipopSelected) this.itemSelected = 'Pirulito';
        new Text(this.itemSelected, (this.canvasW * 0.65), (this.canvasW * 0.8), null, '14px', 'white').draw(this.context);
        this.stage = Stage.FINAL;
        this.interval = setInterval( ()=> {
          this.redraw();
          clearInterval(this.interval);
        }, 2000);
        break;
      }
      case Stage.FINAL: {
        new Text('Finalizado', (this.canvasW * 0.65), (this.canvasW * 0.75), null, '14px', 'white').draw(this.context);
        new Text(`Troco: R$ ${this.transshipment}`, (this.canvasW * 0.65), (this.canvasW * 0.8), null, '14px', 'white').draw(this.context);
        break;
      }
    }
  }

  reset(){
    clearInterval(this.interval);

    this.stage = Stage.START;
    this.itemSelected = null;
    this.totalInsert = 0;
    this.totalRequest = 0;
    this.transshipment = 0;

    this.candyBulletAvailable = false;
    this.candyBulletSelected = false;
    this.candyIceCreamAvailable = false;
    this.candyIceCreamSelected = false;
    this.candyLollipopAvailable = false;
    this.candyLollipopSelected = false;

    this.redraw();
  }

  clear(){
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }


  buildMachine(){
    const reactFull = new React(0, 0, this.context.canvas.width, this.context.canvas.height, '#404752');
    reactFull.drawFill(this.context, false);

    const reactNotes = new React((this.canvasW * 0.6), (this.canvasH * 0.05), 160, 230, '#646C78');
    reactNotes.drawFill(this.context, true);

    const reactPainel = new React((this.canvasW * 0.6), (this.canvasH * 0.5), 160, 160, '#646C78');
    reactPainel.drawFill(this.context, true);

    this.drawResetButton();
    this.drawOkButton();

    this.updatePainel();

  }

  drawNotes(){
    this.noteOne = new Note((this.canvasW * 0.65), (this.canvasH * 0.08), 100, 50, 1, './../assets/images/notas/1-real.jpg');
    this.noteOne.draw(this.context);

    this.noteTwo = new Note((this.canvasW * 0.65), (this.canvasH * 0.2), 100, 50, 2, './../assets/images/notas/2-reais.jpg');
    this.noteTwo.draw(this.context);

    this.noteFive = new Note((this.canvasW * 0.65), (this.canvasH * 0.32), 100, 50, 5, './../assets/images/notas/5-reais.jpg');
    this.noteFive.draw(this.context);
  }

  drawProducts(){
    // Bullet
    if(!this.candyBulletSelected){
      var reactBullet: React;
      if(!this.candyBulletAvailable) reactBullet = new React((this.canvasW * 0.08), (this.canvasH * 0.05), 150, 150, '#dff9fb');
      else reactBullet = new React((this.canvasW * 0.08), (this.canvasH * 0.05), 150, 150, '#2ecc71');
      reactBullet.drawFill(this.context, true);
      this.candyBullet = new Product(1, (this.canvasW * 0.14), (this.canvasH * 0.1), 80, 80, 6, './../assets/images/produtos/candy-1.png', new Text('R$ 6,00', (this.canvasW * 0.23), (this.canvasH * 0.28), null, '16px', 'black'));
      this.candyBullet.draw(this.context);
    }

    // Ice Cream
    if(!this.candyIceCreamSelected){
      var reactIceCream: React;
      if(!this.candyIceCreamAvailable) reactIceCream = new React((this.canvasW * 0.08), (this.canvasH * 0.36), 150, 150, '#dff9fb');
      else reactIceCream = new React((this.canvasW * 0.08), (this.canvasH * 0.36), 150, 150, '#2ecc71');
      reactIceCream.drawFill(this.context, true);
      this.candyIceCream = new Product(3, (this.canvasW * 0.14), (this.canvasH * 0.4), 80, 80, 7, './../assets/images/produtos/candy-2.png', new Text('R$ 7,00', (this.canvasW * 0.23), (this.canvasH * 0.60), null, '16px', 'black'));
      this.candyIceCream.draw(this.context);
    }

    // Lollipop
    if(!this.candyLollipopSelected){
      var reactLollipop: React;
      if(!this.candyLollipopAvailable) reactLollipop = new React((this.canvasW * 0.08), (this.canvasH * 0.67), 150, 150, '#dff9fb');
      else reactLollipop = new React((this.canvasW * 0.08), (this.canvasH * 0.67), 150, 150, '#2ecc71');
      reactLollipop.drawFill(this.context, true);
      this.candyLollipop = new Product(3, (this.canvasW * 0.14), (this.canvasH * 0.73), 80, 80, 8, './../assets/images/produtos/candy-3.png', new Text('R$ 8,00', (this.canvasW * 0.23), (this.canvasH * 0.91), null, '16px', 'black'));
      this.candyLollipop.draw(this.context);
    }
  }

  drawResetButton(){
    this.resetButton = new Button(new React((this.canvasW * 0.60), (this.canvasH * 0.9), 100, 40, 'white'), new Text('Reset', (this.canvasW * 0.65), (this.canvasH * 0.945), null, '18px', 'black'));
    this.resetButton.draw(this.context);
  }

  drawOkButton(){
    this.okButton = new Button(new React((this.canvasW * 0.85), (this.canvasH * 0.9), 40, 40, 'white'), new Text('Ok', (this.canvasW * 0.865), (this.canvasH * 0.945), null, '18px', 'black'));
    this.okButton.draw(this.context);
  }

}
