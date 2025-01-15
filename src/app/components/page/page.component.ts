import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Page } from '../../models/page.model';
import { BookService } from '../../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page',
  imports: [CommonModule],
  template: `
    <button 
      class="block text-center font-bold px-2 py-2"
      [ngClass]="{ 'text-red-500': bookService.pageSelected()?.number === number, 'text-blue-500': bookService.pageSelected()?.number !== number }" 
      (click)="pageClicked.emit(number)">
      {{number}}
    </button>
  `
})
export class PageComponent {
  @Input() 
  page!: Page;


  @Output() 
  pageClicked = new EventEmitter<number>();

  get id(): string {
    return this.page.id;
  }

  get number(): number {
    return this.page.number;
  }

  constructor (public bookService: BookService) {}
}
