import { Injectable, signal } from '@angular/core';
import { Book, Folder, folderOrganisator } from './models';
import { Page } from './models/page.model';
import { ViewService } from './view.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  bibliothek = signal<folderOrganisator>({ books: [], folders: []});
  actualDisplay = signal<folderOrganisator>({ books: [], folders: []});
  actualFolderName = signal<string>('root');
  prev = signal<string | null>(null);
  bookSelected = signal<Book | null>(null);
  pageSelected = signal<Page | null>(null);
  viewBook = signal<boolean>(false);
  indexBookSelected = signal<number>(0);
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

  handleBookClicked(bookClicked: Book) {
    const indexBook = this.actualDisplay().books.findIndex(book => {
      return book.title === bookClicked.title;
    })

    this.setIndex(indexBook);

    if (this.actualFolderName() === "root") {
      this.selectBook(this.bibliothek().books[indexBook])

    } else {
      const indexFolder = this.bibliothek().folders.findIndex(folder => {
        return folder.name === this.actualFolderName();
      })
      this.selectBook(this.bibliothek().folders[indexFolder].items.books[indexBook])
    } 
    
    this.selectPage(this.bookSelected()?.pages[0]!)

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

    const page = this.bookSelected()?.pages[indexCurrentPage - 1];

    if (page) {
      this.selectPage(page);

      editor.innerHTML = this.pageSelected()!.content
    }
  }

  handleNextPage() {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    const indexCurrentPage = this.pageSelected()?.index;

    if (indexCurrentPage === this.bookSelected()?.pages.length! - 1 || indexCurrentPage === undefined) {
      return
    }

    this.retrieveEditorContent();

    const page = this.bookSelected()?.pages[indexCurrentPage + 1];

    if (page) {
      this.selectPage(page);

      editor.innerHTML = this.pageSelected()!.content
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
        this.bookSelected()!.pages[indexCurrentPage].content = container;
      }
    }
  }

  handleSubmitName(event: any) {
    event.preventDefault();
    this.windowCreationFolder.set(false); // trigger window for title
    const name = event.target.title.value  // retrieve user input for title
    const newFolder: Folder = new Folder(name, this.prev() === null ? 'root' : this.prev()!) // initialize a new instance of Book
    // this.actualDisplay.books.push(newBook);   // add the new Book to the display
    
    if (this.actualFolderName() === "root") {
      this.bibliothek().folders.push(newFolder);    // add the new Book to library if in the root Folder
    } else {
      const index = this.bibliothek().folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.actualFolderName();
      })

      this.bibliothek().folders[index].items.folders.push(newFolder);  // add the book
    }
    if (this.newFolderTimeout) {
      clearTimeout(this.newFolderTimeout)
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

  selectBook(book: Book | null) {
    this.bookSelected.set(book);
  }

  selectPage(page: Page | null) {
    this.pageSelected.set(page);
  }

  setIndex(index: number) {
    this.indexBookSelected.set(index);
  }
}
