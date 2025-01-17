import { Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { Item, Book, Folder, folderOrganisator } from '../../models';
import { BookComponent } from '../../components/book/book.component';
import { FolderComponent } from '../../components/folder/folder.component';
import { CommonModule } from '@angular/common';
import { PageComponent } from '../page/page.component';
import { BookService } from '../../book.service';
import { Page } from '../../models/page.model';
import { setActiveConsumer } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule, PageComponent],
  providers: [],
  template: `
    <div class="fixed left-0 w-64 h-full bg-slate-900/75 text-white overflow-y-scroll transition-transform duration-500 ease-in-out">
      <div class="flex justify-center items-center border-y-4 mb-3">
        <h2 class="text-xl py-2">{{ this.bookService.bookSelected() ? this.bookService.bookSelected()?.title : "Library"}}</h2>
      </div>
      @if (!bookService.viewBook()) {
        @if (this.bookService.bookSelected() === null) {
          <div class="flex justify-evenly items-center mb-2">
            <button id="menuDelete" class="hidden px-2 py-2 mb-2 z-10 border rounded-md shadow-md hover:opacity-80" (click)="handleDeleteElement()">delete</button>
            <button id="buttonCreateBook" class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="bookService.handleCreateANewBook()">Create a new Book</button>
            @if (this.prev !== null) {
              <button class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBack()">Back</button>
            }
          </div>
          @for (folder of bookService.actualDisplay().folders; track folder.id) {
            <app-folder [id]="folder.id" (contextmenu)="onRightClickBookAndFolder($event)" [folder]="folder" (folderClicked)="handleFolderClicked($event)" />
          }
          @for (book of bookService.actualDisplay().books; track book.id) {
            <app-book [id]="book.id" (contextmenu)="onRightClickBookAndFolder($event)" [book]="book" (bookClicked)="handleBookClicked($event)"/>
          }
          
        } @else {
          <div class="flex justify-evenly items-center mb-2">
            <button class="block px-1 py-1 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBackFromBook()">Back</button>
            <button id="buttonNewPage" class="block px-1 py-1 ml-1 mr-1 border rounded-md shadow-md hover:opacity-80" (click)="this.bookService.handleNewPage()" >new page</button>
            <button id="buttonDeletePage" class="hidden px-1 py-1 border rounded-md shadow-md hover:opacity-80" (click)="this.bookService.handleDeletePage()" >delete page</button>
          </div>
          @if (this.bookService.bookSelected()!.pages.length > 0) {
            @for (page of this.bookService.bookSelected()!.pages; track page.id) {
            <app-page [page]="page" (contextmenu)="onRightClickPage($event)" (pageClicked)="handlePageClicked($event)"/>
            }
          } @else {
            <p>No page yet !</p>
          }
      }
        
      }
    </div>
  `,
  styles: `
`
})
export class BibliothekComponent implements OnInit {
  prev: string | null = null;
  elementToDelete: HTMLElement | null = null;
  pageToDelete: HTMLElement | null = null;

  
  onRightClickPage(event: MouseEvent): void {
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    this.elementToDelete = targetElement;
    const buttonDeletePage = document.getElementById('buttonDeletePage');
    const buttonNewPage = document.getElementById('buttonNewPage');
    if (buttonDeletePage !== null && buttonNewPage !== null) {
      buttonDeletePage.style.display = 'block'; 
      buttonNewPage.style.display = 'none'
    }

    document.addEventListener('click', () => this.hidewindowPageToDelete());
  }

  hidewindowPageToDelete() {
    const buttonDeletePage = document.getElementById('buttonDeletePage');
    const buttonNewPage = document.getElementById('buttonNewPage');
    if (buttonDeletePage !== null && buttonNewPage !== null) {
      buttonDeletePage.style.display = 'none';
      buttonNewPage.style.display = 'block'
    document.removeEventListener('click', () => this.hidewindowPageToDelete())
    }
  }

  onRightClickBookAndFolder(event: MouseEvent): void { 
    event.preventDefault();
    const targetElement = event.target as HTMLElement;

    this.elementToDelete = targetElement;
    const menuDelete = document.getElementById('menuDelete');
    const buttonCreateBook = document.getElementById('buttonCreateBook');
    if (menuDelete !== null && buttonCreateBook !== null) {
      menuDelete.style.display = 'block'; 
      buttonCreateBook.style.display = 'none'
    }

    document.addEventListener('click', () => this.hidewindowElementToDelete());
  }

  handleDeleteElement() {
    if (this.elementToDelete !== null) {
      
      const name = this.elementToDelete.innerHTML
      const index = this.bookService.actualDisplay().books.findIndex(book => {
        return book.title === name;
      })
      if (index !== -1) {
        this.bookService.actualDisplay().books.splice(index, 1)
      } else {
        const indexFolder = this.bookService.actualDisplay().folders.findIndex(folder => {
          return folder.name === name;
        })
        if (indexFolder !== -1) {
          this.bookService.actualDisplay().folders.splice(indexFolder, 1)
        }
      }
    }
    this.hidewindowElementToDelete();
  }

  hidewindowElementToDelete() {
    const menuDelete = document.getElementById('menuDelete');
    const buttonCreateBook = document.getElementById('buttonCreateBook');
    if (menuDelete !== null && buttonCreateBook !== null) {
      menuDelete.style.display = 'none';
      buttonCreateBook.style.display = 'block'
    document.removeEventListener('click', () => this.hidewindowElementToDelete())
    }
  }
 
  handleClickBackFromBook() { 
    this.bookService.retrieveEditorContent()

    if (this.bookService.actualFolderName() === "root") {
      this.bookService.bibliothek().books.splice(this.bookService.indexBookSelected(), 1, this.bookService.bookSelected()!)
      this.bookService.actualDisplay().books.splice(this.bookService.indexBookSelected(), 1, this.bookService.bookSelected()!)
    } else {
      const index = this.bookService.bibliothek().folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.bookService.actualFolderName();
      })
      this.bookService.bibliothek().folders[index].items.books.splice(this.bookService.indexBookSelected(), 1, this.bookService.bookSelected()!)
    }
    this.bookService.selectBook(null);
  }

  handlePageClicked(pageClicked: Page) {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    
    this.bookService.retrieveEditorContent()

    const page = this.bookService.bookSelected()?.pages[pageClicked.index];

    if (page) {
      this.bookService.selectPage(page);

      editor.innerHTML = this.bookService.pageSelected()!.content
    }
  }


  handleClickBack() {
    if (this.prev !== "root" && this.prev !==null) {
      const index = this.bookService.bibliothek().folders.findIndex(folder => {  // find the index of the current Folder 
        return folder._name === this.prev;
      });
      this.bookService.actualDisplay.set(this.bookService.bibliothek().folders[index]._items)
      this.bookService.actualFolderName.set(this.prev);
      this.prev = this.bookService.bibliothek().folders[index]._name;
    } else if (this.prev === "root") {
      this.bookService.actualDisplay.set(this.bookService.bibliothek());
      this.prev = null;
      this.bookService.actualFolderName.set("root")
    }
  }


  handleBookClicked(bookClicked: Book) {
    const indexBook = this.bookService.actualDisplay().books.findIndex(book => {
      return book.title === bookClicked.title;
    })
    this.bookService.setIndex(indexBook);
    if (this.bookService.actualFolderName() === "root") {
      this.bookService.selectBook(this.bookService.bibliothek().books[indexBook])
    } else {
      const indexFolder = this.bookService.bibliothek().folders.findIndex(folder => {
        return folder.name === this.bookService.actualFolderName();
      })
      this.bookService.selectBook(this.bookService.bibliothek().folders[indexFolder].items.books[indexBook])
    } 

  }

  handleFolderClicked(folderClicked: Folder) {
    const indexFolderToDisplay = this.bookService.bibliothek().folders.findIndex(folder => folder.name === folderClicked.name);
    this.bookService.actualDisplay.set(this.bookService.bibliothek().folders[indexFolderToDisplay].items);
    this.bookService.actualFolderName.set(this.bookService.bibliothek().folders[indexFolderToDisplay]._name);
    this.prev = this.bookService.bibliothek().folders[indexFolderToDisplay]._parent;
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

    this.bookService.bibliothek.set({...library});
    this.bookService.actualDisplay.set({...library});
  }

  constructor (public bookService: BookService) {}

}
