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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule, PageComponent, FormsModule, ReactiveFormsModule],
  providers: [],
  template: `
    <div 
      class="scrolling fixed left-0 top-14 w-64 h-full pb-14 z-50 bg-slate-900/75 text-white overflow-y-scroll transition-transform duration-500 ease-in-out"
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
      
    </div>
    @if (bookService.windowCreationFolder()) {
      <div class="fixed w-full h-full top-0 left-0 z-[52] bg-slate-900/75 text-white">
        <form 
          id="windowFolderCreation" 
          (submit)="handleSubmitName($event)" 
          class="fixed top-[20%] left-1/3 w-2/6 h-2/6 z-[55] border rounded-xl flex flex-col justify-center items-center">
          <label class="mb-2 text-xl" for="name">{{"Name"}}</label>
          <input class="mb-12 w-96 px-2 py-1 text-black" type="text" id="name" name="name" required/>
          <button class="text-lg px-4 py-2 border rounded-md shadow-md hover:opacity-80" type="submit">ok</button>
        </form>
      </div>
    }
    @if (bookService.windowCreationNewBook()) {
      <div class="fixed w-full h-full top-0 left-0 z-[52] bg-slate-900/75 text-white">
        <form [formGroup]="bookForm" 
        (ngSubmit)="handleSubmitTitle($event)" 
        id="windowTitle" 
        class="fixed top-[20%] left-1/3 w-2/6 h-[55%] z-[55] border rounded-xl flex flex-col justify-center items-center"
        autocomplete="off">
          <label class="mb-2 text-xl" for="title">{{"Title"}}</label>
          <input formControlName="title" 
                class="mb-8 w-96 px-2 py-1 text-black" 
                type="text" 
                id="title" 
                name="title" 
                required/>
          
          <div class="w-full mb-4 flex flex-col justify-center items-center">
            <label class="underline underline-offset-4">Size of the book : </label>
            <div class="w-full flex justify-center items-center mt-2">
              <label>
                <input type="radio" formControlName="format" value="small" /> small
              </label>
              <label class="ml-6 mr-6">
                <input type="radio" formControlName="format" value="medium" /> medium
              </label>
              <label>
                <input type="radio" formControlName="format" value="big" /> big
              </label>
            </div>
          </div>

          <div class="w-full mb-8 flex flex-col justify-center items-center">
            <label class="underline underline-offset-4">margin : </label>
            <div class="w-full flex justify-center items-center mt-2">
              <label>
                <input type="radio" formControlName="padding" value="small" /> small
              </label>
              <label class="ml-6 mr-6">
                <input type="radio" formControlName="padding" value="medium" /> medium
              </label>
              <label>
                <input type="radio" formControlName="padding" value="big" /> big
              </label> 
            </div>
          </div>

          <button class="text-lg px-4 py-2 border rounded-md shadow-md hover:opacity-80" 
                  type="submit">Create</button>
        </form>
      </div>
    }
  `,
  styles: `
  .scrolling {
    scrollbar-width: none; /* For Firefox */
    -ms-overflow-style: none; /* For IE and Edge */
  }

  .scrolling::-webkit-scrollbar {
    display: none; /* For Chrome, Safari, and newer versions of Edge */
  }
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
  bookForm: FormGroup;
  dataFetchingTimeout: any;

  handleBookClicked(bookClicked: Book) {

    const indexBook = this.bibliothek.books?.findIndex(book => {
      return book.title === bookClicked.title;
    })

    if (indexBook === -1 || indexBook === undefined) return;
    this.indexBook = indexBook;
    

    this.dataservice.getBook(bookClicked.id).subscribe({
      next: (data) => {
        const book = data[0];
        this.bookService.selectBook(book)
        if (book.pages && book.pages.length > 0) { 
          this.bookService.selectPage(book.pages[0]); 
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
    const name = event.target.name.value  // retrieve user input for title

    this.dataservice.createFolder(name, this.bibliothek.id).subscribe({
      next: (data) => {
        console.log(data)
        this.bibliothek.subfolders?.push(data);
      },
      error: (error) => {
        console.error('Error creating a folder: ', error);
        if (error.error.message && typeof error.error.message === 'string') {
          this.authService.alert.set(error.error.message);

          if (this.dataFetchingTimeout) {
            clearTimeout(this.dataFetchingTimeout)
          }

          this.dataFetchingTimeout = setTimeout(() => {
            this.authService.alert.set('')
          }, 2500)
        }
      }
    });

    if (this.bookService.newFolderTimeout) {
      clearTimeout(this.bookService.newFolderTimeout)
    }
  }

  handleSubmitTitle(event: any) {
    event.preventDefault();
    this.bookService.windowCreationNewBook.set(false); // trigger window for title
    
    if (this.bookForm.valid) {
      console.log('Form Submitted', this.bookForm.value);

      const title = this.bookForm.get('title')?.value; 
      const size = this.bookForm.get('size')?.value; 
      const padding = this.bookForm.get('padding')?.value;

      this.dataservice.createBook(title, size, padding, this.bibliothek.id).subscribe({
        next: (data) => {
          console.log(data)
          this.bibliothek.books?.push(data);
        },
        error: (error) => {
          console.error('Error creating a book: ', error);
          if (error.error.message && typeof error.error.message === 'string') {
            this.authService.alert.set(error.error.message);
  
            if (this.dataFetchingTimeout) {
              clearTimeout(this.dataFetchingTimeout)
            }
  
            this.dataFetchingTimeout = setTimeout(() => {
              this.authService.alert.set('')
            }, 2500)
          }
        }
      });
    }

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
            console.error('Error deleting a book:', error);
            if (error.error.message && typeof error.error.message === 'string') {
              this.authService.alert.set(error.error.message);
    
              if (this.dataFetchingTimeout) {
                clearTimeout(this.dataFetchingTimeout)
              }
    
              this.dataFetchingTimeout = setTimeout(() => {
                this.authService.alert.set('')
              }, 2500)
            }
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
              console.error('Error deleting a folder: ', error);
              if (error.error.message && typeof error.error.message === 'string') {
                this.authService.alert.set(error.error.message);

                if (this.dataFetchingTimeout) {
                  clearTimeout(this.dataFetchingTimeout)
                }

                this.dataFetchingTimeout = setTimeout(() => {
                  this.authService.alert.set('')
                }, 2500)
              }
              
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
    console.log(this.bookService.bookSelected()?.id)

    if (this.bibliothek.root) {
      this.dataservice.updateBook(this.bookService.bookSelected()?.id!, this.bookService.bookSelected()?.pages!).subscribe({
        next: (data) => {
          console.log(data)
        },
        error: (error) => {
          console.error('Error updating book: ', error);
          if (error.error.message && typeof error.error.message === 'string') {
            this.authService.alert.set(error.error.message);

            if (this.dataFetchingTimeout) {
              clearTimeout(this.dataFetchingTimeout)
            }
  
            this.dataFetchingTimeout = setTimeout(() => {
              this.authService.alert.set('')
            }, 2500)
          }
        }
      });

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
          console.error('Error fetching folder when click back: ', error);
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
        console.error('Error fetching a folder when click folder: ', error);
      }
    });
  }

  ngOnInit() {
    this.dataservice.getBibliothek().subscribe({
      next: (data) => {
        const bibliothek = data[0]
        if (isFolder(bibliothek)) {
          console.log(bibliothek)
          this.bibliothek = bibliothek;
        }
        
      },
      error: (error) => {
        console.error('Error fetching root folder: ', error);

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

  constructor (
    private fb: FormBuilder, 
    public bookService: BookService, 
    public viewService: ViewService, 
    public dataservice: DataService,
    public authService: AuthService
  ) {
      this.bookForm = this.fb.group({
        title: ['', Validators.required],
        format: ['', Validators.required],
        padding: ['', Validators.required]
      });
    }

}
