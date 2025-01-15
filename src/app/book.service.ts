import { Injectable, signal } from '@angular/core';
import { Book } from './models';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookSelected = signal<Book | null>(null);
  pageSelected = signal<Page | null>(null)

  constructor() { }

  selectBook(book: Book | null) {
    this.bookSelected.set(book);
  }

  selectPage(page: Page | null) {
    this.pageSelected.set(page);
  }
}
