import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { Item, Book, Folder, folderOrganisator } from '../../models';
import { BookComponent } from '../../components/book/book.component';
import { FolderComponent } from '../../components/folder/folder.component';
import { CommonModule } from '@angular/common';
import { PageComponent } from '../page/page.component';
import { BookService } from '../../book.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule, PageComponent],
  providers: [],
  template: `
    <div class="fixed top-14 left-0 w-64 h-full bg-slate-900/75 text-white">
      <h2 class="mb-1">Library</h2>
      @if (this.bookService.bookSelected() === null) {
          <button class="block" (click)="handleCreateANewBook()">Create a new Book</button>
        @if (this.prev !== null) {
          <button class="block" (click)="handleClickBack()">Back</button>
        }
        @for (folder of actualDisplay.folders; track folder.id) {
          <app-folder [folder]="folder" (folderClicked)="handleFolderClicked($event)" />
        }
        @for (book of actualDisplay.books; track book.id) {
          <app-book [book]="book" (bookClicked)="handleBookClicked($event)"/>
        }
        @if (windowCreationNewBook) {
          <div class="fixed w-full h-full z-20">
            <form (submit)="handleSubmitTitle($event)" class="fixed top-1/2 left-1/2 w-1/5 h-1/5 z-30 flex flex-col justify-center items-center">
              <label for="title">Title</label>
              <input type="text" id="title" name="title" required/>
              <button type="submit">ok</button>
            </form>
          </div>
        }
      } @else {
        <button class="block" (click)="handleClickBackFromBook()">Back</button>
        @if (this.bookService.bookSelected()!.pages.length > 0) {
          @for (page of this.bookService.bookSelected()!.pages; track page.id) {
          <app-page [page]="page" (pageClicked)="handlePageClicked($event)"/>
          }
        } @else {
          <p>No page yet !</p>
        }
        
      }
      
    </div>
  `
})
export class BibliothekComponent implements OnInit {
  bibliothek: folderOrganisator = { books: [], folders: []};
  actualDisplay: folderOrganisator = { books: [], folders: []};
  actualFolderName: string = 'root';
  prev: string | null = null;
  windowCreationNewBook: boolean = false;
 
  handleClickBackFromBook() {
    this.bookService.selectBook(null); 
    // update bibliothek
  }

  handlePageClicked(number: number) {
    console.log("  ")
    console.log("  ")
    const editor = document.getElementById("editor");
    console.log(editor)
    console.log("  ")
    console.log("  ")
    if (editor === null) { 
        return; 
    }
    const container = document.createElement('div');
      editor.childNodes.forEach(node => {
          container.appendChild(node);
          console.log(node)
      })
    const numberCurrentPage = this.bookService.pageSelected()?.number;
    console.log("previous page :")
    console.log(numberCurrentPage)
    if (numberCurrentPage !== undefined) {
      this.bookService.bookSelected()!.pages[numberCurrentPage].content = container;
      console.log(container)
    } 
    const page = this.bookService.bookSelected()?.pages[number];
    if (page) {
      this.bookService.selectPage(page);
      console.log("new page :")
      console.log(page.number)
      this.bookService.pageSelected()!.content.childNodes.forEach(node => {
        editor.appendChild(node)
        console.log(node)
      })
    }
  }

  handleSubmitTitle(event: any) {
    event.preventDefault();
    this.windowCreationNewBook = false; // trigger window for title
    const title = event.target.title.value  // retrieve user input for title
    const newBook: Book = new Book(title, this.actualFolderName) // initialize a new instance of Book
    this.actualDisplay.books.push(newBook);   // add the new Book to the display
    
    if (this.actualFolderName === "root") {
      
      this.bibliothek.books.push(newBook);    // add the new Book to library if in the root Folder
    
    } else {

      const index = this.bibliothek.folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.actualFolderName;
      })

      this.bibliothek.folders[index].items.books.push(newBook);  // add the book
    }
  }

  handleClickBack() {
    if (this.prev !== "root" && this.prev !==null) {
      const index = this.bibliothek.folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.prev;
      });
      this.actualDisplay = this.bibliothek.folders[index]._items
      this.actualFolderName = this.prev;
      this.prev = this.bibliothek.folders[index]._name;
    } else if (this.prev === "root") {
      this.actualDisplay = this.bibliothek;
      this.prev = null;
      this.actualFolderName = "root"
    }
  }

  handleCreateANewBook() {
    this.windowCreationNewBook = true;
  }

  handleBookClicked(bookTitle: string) {
    const indexBook = this.actualDisplay.books.findIndex(book => {
      return book.title === bookTitle;
    })
    if (this.actualFolderName === "root") {
      this.bookService.selectBook(this.bibliothek.books[indexBook])
    } else {
      const indexFolder = this.bibliothek.folders.findIndex(folder => {
        return folder.name === this.actualFolderName;
      })
      this.bookService.selectBook(this.bibliothek.folders[indexFolder].items.books[indexBook])
    } 
  }

  handleFolderClicked(event: string) {
    const indexFolderToDisplay = this.bibliothek.folders.findIndex(folder => folder.name === event);
    this.actualDisplay = this.bibliothek.folders[indexFolderToDisplay].items;
    this.actualFolderName = this.bibliothek.folders[indexFolderToDisplay]._name;
    this.prev = this.bibliothek.folders[indexFolderToDisplay]._parent;
  }

  createPage(node: Node) {
    if (this.bookService.bookSelected() !== null) {
      const numberNextPage = this.bookService.bookSelected()!._pages.length;
      const newPage: Page = new Page(numberNextPage, node, this.bookService.bookSelected()!._parent!)
      this.bookService.bookSelected()!._pages.push(newPage);
    }       
  }

  ngOnInit() {
    const library: folderOrganisator = {
      books: [
        new Book("The Great Gatsby", "root"),
        new Book("1984", "root"),
        new Book("Pride and Prejudice", "root"),
        new Book("To Kill a Mockingbird", "root"),
        new Book("The Catcher in the Rye", "root"),
      ],
      folders: []
    };
    
    // Create and populate folders
    const classics = new Folder("Classics", "root");
    classics.addBook(new Book("Moby Dick", "Classics"));
    classics.addBook(new Book("Don Quixote", "Classics"));
    classics.addBook(new Book("War and Peace", "Classics"));
    
    const sciFi = new Folder("Science Fiction", "root");
    sciFi.addBook(new Book("Dune", "Science Fiction"));
    sciFi.addBook(new Book("Foundation", "Science Fiction"));
    sciFi.addBook(new Book("Neuromancer", "Science Fiction"));
    
    const mystery = new Folder("Mystery", "root");
    mystery.addBook(new Book("The Maltese Falcon", "Mystery"));
    mystery.addBook(new Book("The Big Sleep", "Mystery"));
    mystery.addBook(new Book("Gone Girl", "Mystery"));
    
    const fantasy = new Folder("Fantasy", "root");
    fantasy.addBook(new Book("The Hobbit", "Fantasy"));
    fantasy.addBook(new Book("A Game of Thrones", "Fantasy"));
    fantasy.addBook(new Book("The Name of the Wind", "Fantasy"));
    
    const contemporary = new Folder("Contemporary", "root");
    contemporary.addBook(new Book("The Alchemist", "Contemporary"));
    contemporary.addBook(new Book("The Kite Runner", "Contemporary"));
    contemporary.addBook(new Book("Life of Pi", "Contemporary"));
    
    // Add folders to the library
    library.folders.push(classics, sciFi, mystery, fantasy, contemporary);

    this.bibliothek = {...library};
    this.actualDisplay = {...library};
  }

  constructor (public bookService: BookService) {}

}
