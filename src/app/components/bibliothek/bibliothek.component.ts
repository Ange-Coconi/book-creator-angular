import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Folder } from '../../models/folder.model';
import { folderOrganisator } from '../../models/folderOrganisator.model';
import { BookComponent } from '../../components/book/book.component';
import { FolderComponent } from '../../components/folder/folder.component';
import { CommonModule } from '@angular/common';
import { PageComponent } from '../page/page.component';
import { BookService } from '../../book.service';
import { Page } from '../../models/page.model';
import { ViewService } from '../../view.service';
import { DataService } from '../../data.service';
import { Book } from '../../models/book.model';
import { isFolder } from '../../shared/isFolder';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule, PageComponent],
  providers: [],
  template: `
    <div 
      class="fixed left-0 top-14 w-64 h-full pb-14 z-50 bg-slate-900/75 text-white overflow-y-scroll transition-transform duration-500 ease-in-out"
      [ngClass]="{'-translate-x-56': bookService.viewBook() && !isHovered,'translate-x-0': isHovered}"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      >
      <div class="flex justify-center items-center border-y-4 mb-3">
        <h2 class="text-xl py-2">{{ this.bookService.bookSelected() ? this.bookService.bookSelected()?.title : "Library"}}</h2>
      </div>
      @if (!bookService.viewBook()) {
        @if (this.bookService.bookSelected() === null) {
          <div class="flex justify-evenly items-center mb-2">
            <button id="menuDelete" class="hidden px-2 py-2 mb-2 z-10 border rounded-md shadow-md hover:opacity-80" (click)="handleDeleteElement()">delete</button>
            <button id="buttonCreateFolder" class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="bookService.handleCreateFolder()">Folder</button>
            <button id="buttonCreateBook" class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="bookService.handleCreateANewBook()">Create a new Book</button>
            @if (!bibliothek.root) {
              <button class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBack()">Back</button>
            }
          </div>
          @for (folder of bibliothek.subfolders; track folder.id) {
            <app-folder [id]="folder.id" (contextmenu)="onRightClickBookAndFolder($event)" [folder]="folder" (folderClicked)="handleFolderClicked($event)" />
          }
          @for (book of bibliothek.books; track book.id) {
            <app-book [id]="book.id" (contextmenu)="onRightClickBookAndFolder($event)" [book]="book" (bookClicked)="handleBookClicked($event)"/>
          }
          
        } @else {
          <div class="flex justify-evenly items-center mb-2">
            <button class="block px-1 py-1 border rounded-md shadow-md hover:opacity-80" (click)="handleClickBackFromBook()">Back</button>
            <button id="buttonNewPage" class="block px-1 py-1 ml-1 mr-1 border rounded-md shadow-md hover:opacity-80" (click)="this.bookService.handleNewPage()" >new page</button>
            <button id="buttonDeletePage" class="hidden px-1 py-1 border rounded-md shadow-md hover:opacity-80" (click)="this.bookService.handleDeletePage()" >delete page</button>
          </div>
          @if (bookService.bookSelected()?.pages!.length > 0) {
            @for (page of this.bookService.bookSelected()!.pages; track page.id) {
            <app-page [page]="page" (contextmenu)="onRightClickPage($event)" (pageClicked)="handlePageClicked($event)"/>
            }
          } @else {
            <p>No page yet !</p>
          }
      }
      } @else {
        <h4 class="block w-full text-center">{{ "number of page r/v : " + viewService.numberOfPage()}}</h4>
      }
      @if (bookService.windowCreationNewBook() || bookService.windowCreationFolder()) {
          <div class="fixed w-full h-full top-0 left-0 z-[52] bg-slate-900/75 text-white">
            <form 
              id="windowTitle" 
              (submit)="bookService.windowCreationNewBook() ? handleSubmitTitle($event) : handleSubmitName($event)" 
              class="fixed top-1/3 left-1/3 w-2/6 h-2/6 z-[55] border rounded-xl flex flex-col justify-center items-center">
              <label class="mb-2 text-xl" for="title">{{bookService.windowCreationNewBook() ? "Title" : "Name"}}</label>
              <input class="mb-12 w-96 px-2 py-1 text-black" type="text" id="title" name="title" required/>
              <button class="text-lg px-4 py-2 border rounded-md shadow-md hover:opacity-80" type="submit">ok</button>
            </form>
          </div>
        }
    </div>
  `,
  styles: `
`
})
export class BibliothekComponent implements OnInit, OnDestroy {
  bibliothek: Folder = { id: 0, name: '', root: true, parentFolderId: null, userId: 0, subfolders: [], books: [] }
  indexBook: number = 0;
  isReady: boolean = false;
  elementToDelete: HTMLElement | null = null;
  pageToDelete: HTMLElement | null = null;
  isHovered = false;
  hoverTimeout: any;

  handleBookClicked(bookClicked: Book) {
    const indexBook = this.bibliothek.books?.findIndex(book => {
      return book.title === bookClicked.title;
    })

    if (!indexBook) return;
    this.indexBook = indexBook;

    this.dataservice.getBook(bookClicked.id).subscribe({
      next: (data) => {
        console.log(data)
        this.bookService.selectBook(data)
        if (data.pages && data.pages.length > 0) { 
          this.bookService.selectPage(data.pages[0]); 
        }
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });    
  }

  onMouseEnter(): void {
    this.isHovered = true;

    // Clear any existing timeout to prevent hiding while hovering
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  onMouseLeave(): void {
    // Delay hiding the menu by 1 second after the mouse leaves
    this.hoverTimeout = setTimeout(() => {
      this.isHovered = false;
    }, 1000);
  }
  
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
    const buttonCreateFolder = document.getElementById('buttonCreateFolder');
    if (menuDelete !== null && buttonCreateBook !== null && buttonCreateFolder !== null) {
      menuDelete.style.display = 'block'; 
      buttonCreateBook.style.display = 'none';
      buttonCreateFolder.style.display = 'none';
    }

    document.addEventListener('click', () => this.hidewindowElementToDelete());
  }

  handleSubmitName(event: any) {
    event.preventDefault();
    this.bookService.windowCreationFolder.set(false); // trigger window for title
    const name = event.target.title.value  // retrieve user input for title

    this.dataservice.createFolder(name, this.bibliothek.id).subscribe({
      next: (data) => {
        console.log(data)
        this.bibliothek.subfolders?.push(data);
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });

    if (this.bookService.newFolderTimeout) {
      clearTimeout(this.bookService.newFolderTimeout)
    }
  }

  handleSubmitTitle(event: any) {
    event.preventDefault();
    this.bookService.windowCreationNewBook.set(false); // trigger window for title
    const title = event.target.title.value  // retrieve user input for title
    
    this.dataservice.createBook(title, this.bibliothek.id).subscribe({
      next: (data) => {
        console.log(data)
        this.bibliothek.books?.push(data);
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });

    if (this.bookService.titleTimeout) {
      clearTimeout(this.bookService.titleTimeout)
    }
  }

  handleDeleteElement() {
    if (this.elementToDelete && this.bibliothek.books && this.bibliothek.subfolders) {
      
      const name = this.elementToDelete.innerHTML
      const index = this.bibliothek.books.findIndex(book => {
        return book.title === name;
      })
      if (index !== -1) {
        
        this.dataservice.deleteBook(this.bibliothek.books[index].id).subscribe({
          next: (data) => {
            console.log(data)
          },
          error: (error) => {
            console.error('Error fetching books dashboard: ', error);
          }
        });

        this.bibliothek.books.splice(index, 1)

      } else {
        const indexFolder = this.bibliothek.subfolders.findIndex(folder => {
          return folder.name === name;
        })
        if (indexFolder !== -1) {
          this.dataservice.deleteFolder(this.bibliothek.subfolders[indexFolder].id).subscribe({
            next: (data) => {
              console.log(data)
            },
            error: (error) => {
              console.error('Error fetching books dashboard: ', error);
            }
          });
          this.bibliothek.subfolders.splice(indexFolder, 1)
        }
      }
    }
    this.hidewindowElementToDelete();
  }

  hidewindowElementToDelete() {
    const menuDelete = document.getElementById('menuDelete');
    const buttonCreateBook = document.getElementById('buttonCreateBook');
    const buttonCreateFolder = document.getElementById('buttonCreateFolder');
    if (menuDelete !== null && buttonCreateBook !== null && buttonCreateFolder !== null) {
      menuDelete.style.display = 'none';
      buttonCreateBook.style.display = 'block'
      buttonCreateFolder.style.display = 'block';
    document.removeEventListener('click', () => this.hidewindowElementToDelete())
    }
  }
 
  handleClickBackFromBook() { 
    this.bookService.retrieveEditorContent()

    if (this.bibliothek.root) {
      this.dataservice.updateBook(this.bookService.bookSelected()?.id!, this.bookService.bookSelected()?.pages!)

      this.bibliothek.books?.splice(this.indexBook, 1, this.bookService.bookSelected()!)
    } 

    this.bookService.selectBook(null);
  }

  handlePageClicked(pageClicked: Page) {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    
    this.bookService.retrieveEditorContent()

    const page = this.bookService.bookSelected()?.pages![pageClicked.index];

    if (page && page.content) {
      
      this.bookService.selectPage(page);

      editor.innerHTML = page.content;
    }
  }

  handleClickBack() {
    if (this.bibliothek.parentFolderId) {
      this.dataservice.getFolder(this.bibliothek.parentFolderId).subscribe({
        next: (data) => {
          if (isFolder(data))
          this.bibliothek = data;
        },
        error: (error) => {
          console.error('Error fetching books dashboard: ', error);
        }
      });
    }    
  }

  handleFolderClicked(folderClicked: Folder) {
    this.dataservice.getFolder(folderClicked.id).subscribe({
      next: (data) => {
        if (isFolder(data))
        this.bibliothek = data;
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });
  }

  ngOnInit() {
    this.dataservice.getBibliothek().subscribe({
      next: (data) => {
        console.log(data)
        if (isFolder(data)) {
          console.log(data)
          this.bibliothek = data;
        }
        
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });

    setTimeout(() => {
      this.isReady = true;
    }, 20); // Adjust delay as needed
  }

  ngOnDestroy(): void {
    this.bookService.retrieveEditorContent()
    this.bookService.bookSelected.set(null)
    this.bookService.pageSelected.set(null)
    this.bookService.viewBook.set(false);
  }

  constructor (public bookService: BookService, public viewService: ViewService, public dataservice: DataService) {}

}
