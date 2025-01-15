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
      <div class="flex justify-center items-center border-y-4 mb-3">
        <h2 class="text-xl py-2">Library</h2>
      </div>
      @if (this.bookService.bookSelected() === null) {
        <div class="flex justify-center items-center mb-2">
          <button class="block px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="handleCreateANewBook()">Create a new Book</button>
        </div>
          @if (this.prev !== null) {
            <div class="flex justify-center items-center">
              <button class="block px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBack()">Back</button>
            </div>
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
              <button class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" type="submit">ok</button>
            </form>
          </div>
        }
      } @else {
        <div class="flex justify-center items-center mb-2">
          <button class="block px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBackFromBook()">Back</button>
        </div>
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
    this.bookService.retrieveEditorContent()

    if (this.actualFolderName === "root") {
      this.bibliothek.books.splice(this.bookService.indexBookSelected(), 1, this.bookService.bookSelected()!)
    } else {
      const index = this.bibliothek.folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.actualFolderName;
      })
      this.bibliothek.folders[index].items.books.splice(this.bookService.indexBookSelected(), 1, this.bookService.bookSelected()!)
    }

    this.bookService.selectBook(null);
  }

  handlePageClicked(number: number) {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    
    this.bookService.retrieveEditorContent()
    
    const page = this.bookService.bookSelected()?.pages[number];
    if (page) {
      this.bookService.selectPage(page);

      editor.innerHTML = this.bookService.pageSelected()!.content
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

  // createPage(node: Node) {
  //   if (this.bookService.bookSelected() !== null) {
  //     const numberNextPage = this.bookService.bookSelected()!._pages.length;
  //     const newPage: Page = new Page(numberNextPage, node, this.bookService.bookSelected()!._parent!)
  //     this.bookService.bookSelected()!._pages.push(newPage);
  //   }       
  // }

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
