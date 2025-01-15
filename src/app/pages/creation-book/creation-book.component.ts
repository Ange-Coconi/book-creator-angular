import { Component } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { Page } from '../../models/page.model';
import { Book } from '../../models';
import { BookService } from '../../book.service';

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent, TextEditorComponent],
  template: `
    <div class="w-full h-full ">
      <app-bibliothek (click)="deployMenu()" />
      @if (this.bookService.bookSelected() !== null) {
        <app-text-editor />
      }
    </div>  
  `
})
export class CreationBookComponent {

  deployMenu() {

  }

  constructor (public bookService: BookService) {}

}
