import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Book } from '../../models';

@Component({
  selector: 'app-book',
  imports: [],
  standalone: true,
  template: `
    <div class="flex justify-left items-center shadow-md hover:opacity-80">
      <svg class="ml-2 fill-white w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" style="enable-background:new 0 0 128 128" xml:space="preserve"><path d="M110.6 38.3H106v-3.5c0-1-.8-1.7-1.7-1.8H70.8c-2.7 0-5.2 1.2-6.8 3.3-1.6-2.1-4.1-3.3-6.8-3.3H23.7c-1 0-1.7.8-1.7 1.8v3.5h-4.6c-1 0-1.8.8-1.8 1.8v57c0 1 .8 1.7 1.8 1.8h93.1c1 0 1.7-.8 1.8-1.8V40c0-.9-.8-1.7-1.7-1.7zm-39.8-1.8h31.7v51.9H70.8c-2.9 0-4.6 1.4-5 1.6V41.6c0-.4 0-.7-.1-1.1.5-2.2 2.6-4 5.1-4zm-45.3 0h31.7c2.6 0 4.7 1.9 5 4.1 0 .4-.1.7-.1 1.1V90c-.3-.1-2.1-1.6-5-1.6H25.5V36.5zm-6.3 5.3H22v48.3c0 1 .8 1.8 1.8 1.8h33.5c2 0 3.9 1.1 4.8 3.4H19.2V41.8zm89.6 53.5H66c.8-2.2 2.8-3.4 4.8-3.4h33.5c1 0 1.8-.8 1.8-1.8V41.8h2.8l-.1 53.5z"/><path d="M32.7 50h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H32.7c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8zM32.7 59.3h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H32.7c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8zM32.7 68.7h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H32.7c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8zM32.7 78h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H32.7c-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8zM72.8 50h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H72.8c-1 0-1.8.8-1.8 1.8s.9 1.8 1.8 1.8zM72.8 59.3h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H72.8c-1 0-1.8.8-1.8 1.8s.9 1.8 1.8 1.8zM72.8 68.7h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H72.8c-1 0-1.8.8-1.8 1.8s.9 1.8 1.8 1.8zM72.8 78h22.5c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8H72.8c-1 0-1.8.8-1.8 1.8s.9 1.8 1.8 1.8z"/></svg>
      <button class="ml-4 block text-center text-white px-2 py-2" (click)="bookClicked.emit(title)">{{title}}</button>
    </div>
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
