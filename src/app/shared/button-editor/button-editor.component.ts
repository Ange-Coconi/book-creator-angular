import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-editor',
  imports: [],
  template: `
    <button 
      class="w-full h-full bg-slate-300 text-black px-2 py-2 border rounded-md shadow-md hover:opacity-80"
      (click)="boutonClicked.emit()"
      >
      {{name}}</button>
  `
})
export class ButtonEditorComponent {
  @Input()
  name: string = '';

  @Output()
  boutonClicked = new EventEmitter<any>();

}
