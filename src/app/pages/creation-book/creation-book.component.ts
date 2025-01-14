import { Component } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent, TextEditorComponent],
  template: `
    <div class="w-full h-full ">
      <app-bibliothek (click)="deployMenu()" />
      <app-text-editor />
      <p class="test">Hello world !</p>
    </div>  
  `
})
export class CreationBookComponent {

  deployMenu() {

  }
}
