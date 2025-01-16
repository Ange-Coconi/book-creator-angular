import { Injectable, signal } from '@angular/core';
import { Book, folderOrganisator } from './models';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bibliothek = signal<folderOrganisator>({ books: [], folders: []});
  actualDisplay = signal<folderOrganisator>({ books: [], folders: []});
  actualFolderName = signal<string>('root');
  bookSelected = signal<Book | null>(null);
  pageSelected = signal<Page | null>(null);
  indexBookSelected = signal<number>(0);
  windowCreationNewBook= signal<boolean>(false);
  titleTimeout: any;
  
  boundHandleClickElsewhere: (event: MouseEvent) => void;

  constructor() {
    this.boundHandleClickElsewhere = this.handleClickElsewhere.bind(this);
   }

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

    if (this.pageSelected() !== null && this.pageSelected() !== undefined) {
      const indexCurrentPage = this.pageSelected()?.index;

      if (indexCurrentPage !== undefined) {
        this.bookSelected()!.pages[indexCurrentPage].content = container;
      }
    }
  }

  handleSubmitTitle(event: any) {
    event.preventDefault();
    this.windowCreationNewBook.set(false); // trigger window for title
    const title = event.target.title.value  // retrieve user input for title
    const newBook: Book = new Book(title, this.actualFolderName()) // initialize a new instance of Book
    // this.actualDisplay.books.push(newBook);   // add the new Book to the display
    
    if (this.actualFolderName() === "root") {
      this.bibliothek().books.push(newBook);    // add the new Book to library if in the root Folder
    } else {
      const index = this.bibliothek().folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.actualFolderName();
      })

      this.bibliothek().folders[index].items.books.push(newBook);  // add the book
    }
    if (this.titleTimeout) {
      clearTimeout(this.titleTimeout)
    }
  }

  handleCreateANewBook() {
    this.windowCreationNewBook.set(true);

    this.titleTimeout = setTimeout(() => {
      document.addEventListener('click', this.boundHandleClickElsewhere)
    }, 500)    
  }

  handleClickElsewhere(event: MouseEvent) {

    const windowTitle = document.getElementById('windowTitle'); // Replace with your popup class or ID
    if (windowTitle && windowTitle.contains(event.target as Node)) {
      return;
    }

    this.windowCreationNewBook.set(false);
    document.removeEventListener('click', this.boundHandleClickElsewhere)
    if (this.titleTimeout) {
      clearTimeout(this.titleTimeout)
    } 
  }

  handleDeletePage() {
    const indexPage = this.pageSelected()?.index;
    if (indexPage !== undefined && indexPage !== null) {
        this.bookSelected()?.pages.splice(indexPage, 1);
        this.bookSelected()?.pages.forEach((page, index) => {
          if (page.name === page.index.toString()) {
            page.name = index.toString()
          }
          page.index = index;
        });
    }
    this.selectPage(null)
    this.retrieveEditorContent()
    if (this.bookSelected()?.pages.length! === 0) {
        this.handleNewPage()
    } else {
        const indexLastPage = this.bookSelected()!._pages.length;
        const page = this.bookSelected()?.pages[indexLastPage];
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
    this.retrieveEditorContent()

    const indexNextPage = this.bookSelected()!._pages.length;

    const newPage: Page = new Page(indexNextPage, '', this.bookSelected()!.title)
    this.bookSelected()!._pages.push(newPage);

    const page = this.bookSelected()?.pages[indexNextPage];
    if (page) {
    this.selectPage(page);
    }
  }
}
