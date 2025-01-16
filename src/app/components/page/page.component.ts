import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Page } from '../../models/page.model';
import { BookService } from '../../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  imports: [CommonModule],
  template: `
  <button class="w-full flex justify-left items-center shadow-md hover:opacity-80" (click)="pageClicked.emit(page)">
    <svg class="ml-3.5 fill-white" [ngClass]="{ 'fill-green-300 bold': bookService.pageSelected()?.index === index, 'text-white': bookService.pageSelected()?.index !== index }" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50"><path d="M 7 2 L 7 48 L 43 48 L 43 14.59375 L 42.71875 14.28125 L 30.71875 2.28125 L 30.40625 2 Z M 9 4 L 29 4 L 29 16 L 41 16 L 41 46 L 9 46 Z M 31 5.4375 L 39.5625 14 L 31 14 Z M 15 22 L 15 24 L 35 24 L 35 22 Z M 15 28 L 15 30 L 31 30 L 31 28 Z M 15 34 L 15 36 L 35 36 L 35 34 Z"></path></svg>
    <div 
      class="ml-5 block text-center text-white px-2 py-2"
      [ngClass]="{ 'text-green-300 bold': bookService.pageSelected()?.index === index, 'text-white': bookService.pageSelected()?.index !== index }" 
      >
      {{name === index.toString() ? "page " + index.toString() : name}}
    </div>
  </button>
  `
})
export class PageComponent {
  @Input() 
  page!: Page;


  @Output() 
  pageClicked = new EventEmitter<Page>();

  get id(): string {
    return this.page.id;
  }

  get index(): number {
    return this.page.index;
  }

  get name(): string {
    return this.page.name;
  }


  constructor (public bookService: BookService) {}
}
