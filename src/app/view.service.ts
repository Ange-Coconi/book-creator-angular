import { Injectable, signal } from '@angular/core';
import { Page } from './models/page.model';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentPage = signal<number>(-1)
  ListOfPage = signal<Page[]>([])

  handleNextPage() {
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'left'

    let idCurrentPage = ''
    if (this.currentPage() === -1) {
      idCurrentPage = 'cover';
    } else if (this.currentPage() > this.ListOfPage().length + 1) {
      return
    } else if (this.currentPage() === this.ListOfPage().length) {
      idCurrentPage = 'back';
    } else {
      idCurrentPage = `page-${this.currentPage()}`;
    }

    const variation = this.currentPage() + 1;

    const pageHTML = document.getElementById(idCurrentPage);
    if (!pageHTML) return
    pageHTML.style.transform = `translateX(${variation}px) rotateY(${-180 + variation}deg)`;

    if (this.currentPage() <= this.ListOfPage().length ) {
      this.currentPage.set(this.currentPage() + 1)
    }
  }

  handlePreviousPage() {
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'right'

    let idPreviousPage = ''
    if (this.currentPage() === 0) {
      idPreviousPage = 'cover';
    } else if (this.currentPage() > this.ListOfPage().length) {
      idPreviousPage = 'back'
    } else {
      idPreviousPage = `page-${this.currentPage() - 1}`;
    }

    const pageHTML = document.getElementById(idPreviousPage);

    if (!pageHTML) return
    pageHTML.style.transform = ``;

    if (this.currentPage() > -1) {
      this.currentPage.set(this.currentPage() - 1)
    }
    
  }

}
