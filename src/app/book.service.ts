import { Injectable, signal } from '@angular/core';
import { Book } from './models';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookSelected = signal<Book | null>(null);
  pageSelected = signal<Page | null>(null);
  indexBookSelected = signal<number>(0);

  constructor() { }

  selectBook(book: Book | null) {
    this.bookSelected.set(book);
  }

  selectPage(page: Page | null) {
    this.pageSelected.set(page);
  }

  setIndex(index: number) {
    this.indexBookSelected.set(index);
  }

  retrieveEditorContent() {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    const container = editor.innerHTML
    editor.innerHTML = "";

    const numberCurrentPage = this.pageSelected()?.number;

    if (numberCurrentPage !== undefined) {
      this.bookSelected()!.pages[numberCurrentPage].content = container;
    } 
  }
}
