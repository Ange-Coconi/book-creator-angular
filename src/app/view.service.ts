import { Injectable, signal } from '@angular/core';
import { Page } from './models/page.model';
import { PageRectoVerso } from './models/page-recto-verso.model';

@Injectable({
  providedIn: 'root'
})
export class ViewService {
  currentPage = signal<number>(-1)
  lisfOfPage = signal<Page[]>([])
  pageListRectoVerso = signal<Array<PageRectoVerso>>([]);
  numberOfPage = signal<number>(0);
  zIndexStackLeft = signal<number>(0);
  zIndexStackRight = signal<number>(0);
  boxShadowTimeout: any = null;
  zIndexTimeout: any = null;


  handleNextPage() {
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'left'

    let idCurrentPage = '';
    if (this.currentPage() === -1) {
      idCurrentPage = 'cover';
    } else if (this.currentPage() > this.pageListRectoVerso().length + 1) {
      return
    } else if (this.currentPage() === this.pageListRectoVerso().length) {
      idCurrentPage = 'back';
    } else {
      idCurrentPage = `page-${this.currentPage()}`;
    }

    const pageHTML = document.getElementById(idCurrentPage);
        
    if (!pageHTML) return

    pageHTML.style.transform = `rotateY(-180deg)`;
    if (this.currentPage() > -1 && this.currentPage() < this.numberOfPage() ) {
      pageHTML.style.marginLeft = '';
      pageHTML.style.marginRight = `${Math.floor(this.currentPage() / 3)}px`;
    }

    
    if (this.zIndexTimeout) {
      clearTimeout(this.zIndexTimeout);
    };

    this.zIndexTimeout = setTimeout(() => {
      this.zIndexNextPage(this.currentPage(), pageHTML);
    }, 10);
    

    if (this.currentPage() <= this.pageListRectoVerso().length ) {
      this.currentPage.set(this.currentPage() + 1)
    } 
    
    if (this.currentPage() > this.pageListRectoVerso().length) {
      bookHTML.style.boxShadow = '';
      bookHTML.classList.remove('shadow');
    }
  }

  handlePreviousPage() {
    const bookHTML = document.getElementById('book');
    if (!bookHTML) return
    bookHTML.style.transformOrigin = 'right'

    let idPreviousPage = ''
    if (this.currentPage() < -1) {
      return
    }
    else if (this.currentPage() === 0) {
      idPreviousPage = 'cover';
    } else if (this.currentPage() > this.pageListRectoVerso().length) {
      idPreviousPage = 'back'
    } else {
      idPreviousPage = `page-${this.currentPage() - 1}`;
    }

    const pageHTML = document.getElementById(idPreviousPage);

    if (!pageHTML) return
    pageHTML.style.transform = ``;

    if (this.currentPage() > this.pageListRectoVerso().length) {
      if (this.boxShadowTimeout) {
        clearTimeout(this.boxShadowTimeout);
      }

      // Set a new timeout to apply the shadow after 2 seconds
      this.boxShadowTimeout = setTimeout(() => {
        bookHTML.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.7)';

        // Optional: Reset the timeout ID if needed for other checks
        this.boxShadowTimeout = null;
      }, 2000);
    };

    if (this.currentPage() > -1 && this.currentPage() < this.numberOfPage() ) {
      pageHTML.style.marginLeft = `${Math.floor(this.currentPage() / 3)}px`;
      pageHTML.style.marginRight = '';
    };

    this.zIndexPreviousPage(this.currentPage(), pageHTML);

    if (this.currentPage() > -1) {
      this.currentPage.set(this.currentPage() - 1)
    }
  }

  zIndexNextPage(pageIndex: number, pageHTML: HTMLElement) {
    if (pageIndex === -1) {
      this.zIndexStackLeft.set(0);
    }

    if (pageHTML) {
      this.zIndexStackRight.set(this.zIndexStackRight() - 5)
      this.zIndexStackLeft.set(this.zIndexStackLeft() + 5);
      pageHTML.style.zIndex = this.zIndexStackLeft().toString();
      console.log("left :")
      console.log(this.zIndexStackLeft())
      console.log("right :")
      console.log(this.zIndexStackRight())
      const rectoHTML = document.getElementById('page-' + pageIndex.toString() + '-recto')
      const versoHTML = document.getElementById('page-' + pageIndex.toString() + '-verso')

      if (rectoHTML && versoHTML) { 
        rectoHTML.style.zIndex = (this.zIndexStackLeft() - 1).toString();
        versoHTML.style.zIndex = (this.zIndexStackLeft() + 1).toString();
      }
    }
    
  }

  zIndexPreviousPage(pageIndex: number, pageHTML: HTMLElement) {
    if (pageIndex > this.numberOfPage()) {
      this.zIndexStackRight.set(0);
    }

    if (pageHTML) {
      this.zIndexStackLeft.set(this.zIndexStackLeft() - 5);
      this.zIndexStackRight.set(this.zIndexStackRight() + 5);
      console.log("left :")
      console.log(this.zIndexStackLeft())
      console.log("right :")
      console.log(this.zIndexStackRight())
      pageHTML.style.zIndex = this.zIndexStackRight().toString();

      const rectoHTML = document.getElementById('page-' + pageIndex.toString() + '-recto')
      const versoHTML = document.getElementById('page-' + pageIndex.toString() + '-verso')
    
      if (rectoHTML && versoHTML) {   

        rectoHTML.style.zIndex = (this.zIndexStackLeft() + 1).toString();
        versoHTML.style.zIndex = (this.zIndexStackLeft() - 1).toString();
      }
    }
  }

}
