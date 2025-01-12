import { Component } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent],
  template: `
    <div class="w-screen h-screen border-r border-1 border-solid">
      <app-bibliothek (click)="deployMenu()" />
    </div>  
  `,
  styles: `
  `
})
export class CreationBookComponent {

  deployMenu() {

  }
}
