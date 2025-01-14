import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Book } from '../../models';

@Component({
  selector: 'app-book',
  imports: [],
  standalone: true,
  template: `
    <button class="block text-center text-green-500 px-2 py-2" (click)="bookClicked.emit(title)">{{title}}</button>
  `,
  styles: ``
})
export class BookComponent {
  @Input() 
  book!: Book ;


  @Output() 
  bookClicked = new EventEmitter<string>();

  get id(): string {
    return this.book.id;
  }

  get title(): string {
    return this.book.title;
  }
}
