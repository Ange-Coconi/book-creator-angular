import { Injectable, signal } from '@angular/core';
import { Page } from './models/page.model';
import { PageRectoVerso } from './models/page-recto-verso.model';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentPage = signal<number>(-1)
  lisfOfPage = signal<Page[]>([])
  reversedPageListRectoVerso = signal<Array<PageRectoVerso>>([]);
  pageListRectoVerso = signal<Array<PageRectoVerso>>([]);
  numberOfPage = signal<number>(0);

  handleNextPage() {
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'left'

    let idCurrentPage = '';
    if (this.currentPage() === -1) {
      idCurrentPage = 'cover';
    } else if (this.currentPage() > this.reversedPageListRectoVerso().length + 1) {
      return
    } else if (this.currentPage() === this.reversedPageListRectoVerso().length) {
      idCurrentPage = 'back';
    } else {
      idCurrentPage = `page-${this.currentPage()}`;
    }

    const variation = this.currentPage() + 1;
    const pageHTML = document.getElementById(idCurrentPage);
    
    if (!pageHTML) return
    pageHTML.style.transform = `translateX(${variation}px) rotateY(${-180 + variation}deg)`;

    if (this.currentPage() !== -1 && this.currentPage() !== this.reversedPageListRectoVerso().length) {

      const contentPageHTML = document.getElementById(idCurrentPage + '-content')

      if (!contentPageHTML) return
      console.log(this.reversedPageListRectoVerso()[this.currentPage()])
      console.log(this.reversedPageListRectoVerso()[this.currentPage()].verso._content)
      contentPageHTML.innerHTML = this.reversedPageListRectoVerso()[this.currentPage()].verso._content;
      contentPageHTML.style.backfaceVisibility = 'hidden';
      contentPageHTML.style.transform = `translateX(-${variation}px) rotateY(${180 - variation}deg)`;
    }
    

    if (this.currentPage() <= this.reversedPageListRectoVerso().length ) {
      this.currentPage.set(this.currentPage() + 1)
    }

  }

  handlePreviousPage() {
    console.log("when call :")
    console.log(this.currentPage())
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'right'


    let idPreviousPage = ''
    if (this.currentPage() < -1) {
      return
    }
    else if (this.currentPage() === 0) {
      idPreviousPage = 'cover';
    } else if (this.currentPage() > this.reversedPageListRectoVerso().length) {
      idPreviousPage = 'back'
    } else {
      idPreviousPage = `page-${this.currentPage() - 1}`;
    }
    console.log("here")
    const pageHTML = document.getElementById(idPreviousPage);

    if (!pageHTML) return
    pageHTML.style.transform = ``;

    if (this.currentPage() > 0 && this.currentPage() < this.reversedPageListRectoVerso().length) {

      const contentPageHTML = document.getElementById(idPreviousPage + '-content');
      console.log(contentPageHTML)
      if (!contentPageHTML) return
      contentPageHTML.innerHTML = this.reversedPageListRectoVerso()[this.currentPage() - 1].recto._content;
      contentPageHTML.style.backfaceVisibility = '';
      contentPageHTML.style.transform = ``;
    }

    if (this.currentPage() > -1) {
      this.currentPage.set(this.currentPage() - 1)
    }
    console.log("By the end :")
    console.log(this.currentPage())
    
  }

}
