import { Injectable, signal } from '@angular/core';
import { Book } from './models/book.model';
import { Folder } from './models/folder.model';
import { Page } from './models/page.model';
import { ViewService } from './view.service';
import { updateIndex } from './shared/updateIndex';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bookSelected = signal<Book | null>(null);
  pageSelected = signal<Page | null>(null);
  viewBook = signal<boolean>(false);
  windowCreationNewBook= signal<boolean>(false);
  windowCreationFolder= signal<boolean>(false);
  newFolderTimeout: any;
  titleTimeout: any;
  viewService: ViewService;
  
  boundHandleClickElsewhere: (event: MouseEvent) => void;

  constructor(viewService: ViewService) {
    this.viewService = viewService;
    this.boundHandleClickElsewhere = this.handleClickElsewhere.bind(this);
   }

  handleViewBook() {
    this.retrieveEditorContent();
    this.viewBook.set(true);  

    if (this.bookSelected()?.pages === undefined) return

    this.viewService.lisfOfPage.set(this.bookSelected()?.pages!)
    
  }

  handleViewEditor() {
    console.log(this.bookSelected())
    this.viewBook.set(false);
    this.viewService.currentPage.set(-1);
    this.viewService.lisfOfPage.set([]);
  }

  handlePreviousPage() {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }

    const indexCurrentPage = this.pageSelected()?.index;
    if (indexCurrentPage === 0 || indexCurrentPage === undefined) {
      return
    }
    this.retrieveEditorContent();

    const page = this.bookSelected()?.pages![indexCurrentPage - 1];

    if (page && page.content) {
      this.selectPage(page);

      editor.innerHTML = page.content;
    }
  }

  handleNextPage() {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    const indexCurrentPage = this.pageSelected()?.index;

    if (indexCurrentPage === this.bookSelected()?.pages!.length! - 1 || indexCurrentPage === undefined) {
      return
    }

    this.retrieveEditorContent();

    const page = this.bookSelected()?.pages![indexCurrentPage + 1];

    if (page && page.content) {
      this.selectPage(page);

      editor.innerHTML = page.content
    }
  }

  retrieveEditorContent() {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    const container = editor.innerHTML
    editor.innerHTML = "";

    if (this.pageSelected() !== null && this.pageSelected() !== undefined) {
      const indexCurrentPage = this.pageSelected()?.index;

      if (indexCurrentPage !== undefined) {
        this.bookSelected()!.pages![indexCurrentPage].content = container;
      }
    }
  }

  handleCreateFolder() {
    this.windowCreationFolder.set(true);

    this.newFolderTimeout = setTimeout(() => {
      document.addEventListener('click', this.boundHandleClickElsewhere)
    }, 500)  
  }

  handleCreateANewBook() {
    this.windowCreationNewBook.set(true);

    this.titleTimeout = setTimeout(() => {
      document.addEventListener('click', this.boundHandleClickElsewhere)
    }, 500)    
  }

  handleClickElsewhere(event: MouseEvent) {

    const window = document.getElementById('windowTitle'); // Replace with your popup class or ID
    if (window && window.contains(event.target as Node)) {
      return;
    }

    if (this.windowCreationNewBook()) {
      this.windowCreationNewBook.set(false);
      document.removeEventListener('click', this.boundHandleClickElsewhere)
      if (this.titleTimeout) {
        clearTimeout(this.titleTimeout)
      } 
    } else {
      this.windowCreationFolder.set(false);
      document.removeEventListener('click', this.boundHandleClickElsewhere)
      if (this.newFolderTimeout) {
        clearTimeout(this.newFolderTimeout)
      } 
    }
    
  }

  handleDeletePage() {
    const indexPage = this.pageSelected()?.index;
    if (indexPage !== undefined && indexPage !== null) {
        this.bookSelected()?.pages!.splice(indexPage, 1);
        this.bookSelected()?.pages!.forEach((page, index) => {
          page.index = index;
        });
    }
    this.selectPage(null)
    this.retrieveEditorContent()
    if (this.bookSelected()?.pages!.length! === 0) {
        this.handleNewPage()
    } else {
        const indexLastPage = this.bookSelected()!.pages!.length;
        const page = this.bookSelected()?.pages![indexLastPage];
        if (page) {
        this.selectPage(page);
        }
    }
}
  
  checkOverflow() {
    const editor = document.getElementById("editor");
    if (editor === null) { return }

    if (editor.scrollHeight > editor.clientHeight) {
        this.handleNewPage();
    }
  }
  
  handleNewPage() {
    this.retrieveEditorContent();
  
    const bookSelected = this.bookSelected();
    const pageSelected = this.pageSelected();
  
    if (bookSelected && bookSelected.pages && pageSelected) {
      const pagesLength = bookSelected.pages.length;
      const pageIndex = pageSelected.index;
  
      if (pageIndex === pagesLength - 1) {
        const newPage = { index: pagesLength, content: '', bookId: bookSelected.id };
  
        if (newPage && newPage.bookId !== undefined) {
          this.selectPage(newPage);
        }
      } else {
        const newPage = { index: pageIndex, content: '', bookId: bookSelected.id };
        
        if (newPage && newPage.bookId !== undefined) {
          updateIndex(bookSelected, pageIndex);
          this.selectPage(newPage);
        }
      }
    } else {
      console.error('Book or Page is undefined');
    }
  }
  

  selectBook(book: Book | null) {
    this.bookSelected.set(book);
  }

  selectPage(page: Page | null) {
    this.pageSelected.set(page);
  }

}
