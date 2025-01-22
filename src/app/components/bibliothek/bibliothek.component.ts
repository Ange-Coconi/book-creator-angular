import { Component, OnDestroy, OnInit } from '@angular/core';
import { Folder } from '../../models/folder.model';
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
import JSZip from 'jszip';
import { FileUploadHandler } from '../../shared/file-upload.handler';

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
        <button 
          class="fixed left-2 w-6 h-6 fill-white " 
          (click)="bookService.bookSelected() ? handleDownload() : handleUpload($event) "
          (mouseenter)="onDownloadIconHover()"
          (mouseleave)="onDownloadIconHoverOut()"
          >
          <p 
            class="absolute text-[10px] p-2 transition-transform duration-500 ease-in-out rounded-md bg-slate-900/75 text-white" 
            [ngClass]="{'block': download, 'none': !download }">{{bookService.bookSelected() ? 'Download your book' : 'Upload your book'}}</p>
          <svg  xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 444.019"><path fill-rule="nonzero" d="M.723 320.533c-2.482-10.26 1.698-18.299 8.38-23.044a23.417 23.417 0 018.018-3.632c2.877-.699 5.88-.864 8.764-.452 8.127 1.166 15.534 6.417 18.013 16.677a631.854 631.854 0 014.317 19.092 1205.66 1205.66 0 013.418 16.772c4.445 22.442 7.732 36.511 16.021 43.526 8.775 7.422 25.366 9.984 57.167 9.984h268.042c29.359 0 44.674-2.807 52.736-10.093 7.768-7.022 10.805-20.735 14.735-41.777l.007-.043c.916-4.946 1.889-10.139 3.426-17.758 1.298-6.427 2.722-13.029 4.34-19.703 2.484-10.255 9.886-15.503 18.008-16.677 2.861-.41 5.846-.242 8.722.449 2.905.699 5.679 1.935 8.068 3.633 6.672 4.742 10.843 12.763 8.38 22.997l-.011.044a493.707 493.707 0 00-3.958 17.975c-1.011 5.023-2.169 11.215-3.281 17.177l-.008.044c-5.792 31.052-10.544 52.357-26.462 67.318-15.681 14.742-40.245 20.977-84.699 20.977H124.823c-46.477 0-72.016-5.596-88.445-20.144-16.834-14.909-21.937-36.555-28.444-69.403-1.316-6.653-2.582-13.005-3.444-17.125-1.213-5.782-2.461-11.434-3.767-16.814zm131.02-190.804L255.079 0l125.184 131.556-34.53 32.848-66.774-70.174.201 158.278h-47.594l-.202-158.397-65.092 68.466-34.529-32.848zM279.191 276.45l.028 22.977h-47.594l-.028-22.977h47.594zm.046 37.794l.024 18.65h-47.595l-.023-18.65h47.594z"/></svg>
        </button>
      </div>
      @if (!bookService.viewBook()) {
        @if (this.bookService.bookSelected() === null) {
          <div class="flex justify-evenly items-center mb-2">
            <button id="menuDelete" class="hidden px-2 py-2 mb-2 z-10 border rounded-md shadow-md hover:opacity-80" (click)="handleDeleteElement()">delete</button>
            <button id="buttonCreateFolder" class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="bookService.handleCreateFolder()">Folder</button>
            <button id="buttonCreateBook" class="px-2 py-2 border rounded-md shadow-md hover:opacity-80" (click)="bookService.handleCreateANewBook()">New Book</button>
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
        <form [formGroup]="uploadingProcess ? bookFormUpload : bookForm" 
        (ngSubmit)="uploadingProcess ? handleSubmitTitleUpload($event) : handleSubmitTitle($event)" 
        id="windowTitle" 
        class="fixed top-[20%] left-1/3 w-2/6 h-[55%] z-[55] border rounded-xl flex flex-col justify-center items-center"
        autocomplete="off">
          @if (!uploadingProcess) {
            <label class="mb-2 text-xl" for="title">{{"Title"}}</label>
            <input formControlName="title" 
                  class="mb-8 w-96 px-2 py-1 text-black" 
                  type="text" 
                  id="title" 
                  name="title" 
                  required/>
          }          
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

  .block { display: block; } 
  .none { display: none}
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
  bookFormUpload: FormGroup;
  dataFetchingTimeout: any;
  download = false;
  uploadingProcess = false;
  dataUpload: string[] = [];

  onDownloadIconHover() {
    this.download = true;
  }

  onDownloadIconHoverOut() {
    this.download = false;
  }

  async handleUpload(event: Event) {
    const result = await FileUploadHandler.handleFolderUpload(event);
    
    if (result.errorMessage) {
      // Zeige Fehlermeldung an
      console.error(result.errorMessage);
    }
    
    if (result.successMessage) {
      // Zeige Erfolgsmeldung an
      console.log(result.successMessage);
    }
    if (result.files) {
      this.uploadingProcess = true;
      this.dataUpload = result.files;
      this.bookService.handleCreateANewBook()
    }
  }

  handleDownload() {
    const pages = this.bookService.bookSelected()?.pages;
    const title = this.bookService.bookSelected()?.title
    if (!pages || !title) return

    async function downloadPagesAsZip(pages: Page[], title: string) {
        const zip = new JSZip();
        const folder = zip.folder(`${title}`);
        let agregate = ''
        // Add each page to the zip file
        pages.forEach((page, index) => {
          folder?.file(`page${index + 1}.txt`, page.content);
          agregate += page.content;
        });
        
        zip.file(`${title}.txt`, agregate);
        // Generate the zip file
        const zipContent = await zip.generateAsync({ type: "blob" });
      
        // Create a download link and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipContent);
        link.download = "pages.zip";
        link.click();
      
        // Clean up
        URL.revokeObjectURL(link.href);
    }   
    
    downloadPagesAsZip(pages, title);
  }

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
      const format = this.bookForm.get('format')?.value; 
      const padding = this.bookForm.get('padding')?.value;

      this.dataservice.createBook(title, format, padding, this.bibliothek.id).subscribe({
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

  handleSubmitTitleUpload(event: any) {
    event.preventDefault();
    this.bookService.windowCreationNewBook.set(false); // trigger window for title
    console.log(this.bookFormUpload.valid)
    if (this.bookFormUpload.valid) {
      console.log('Form Submitted', this.bookFormUpload.value);

      const format = this.bookFormUpload.get('format')?.value; 
      const padding = this.bookFormUpload.get('padding')?.value;

      this.dataservice.createBookUploaded(this.dataUpload, format, padding, this.bibliothek.id).subscribe({
        next: (data) => {
          console.log(data)
          const bookUploaded = data;

          this.bibliothek.books?.push(bookUploaded);
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

    this.dataUpload = [];
    this.uploadingProcess = false;
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

    this.dataservice.updateBook(this.bookService.bookSelected()?.id!, this.bookService.bookSelected()?.pages!).subscribe({
      next: (data) => {

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
    this.bookService.selectBook(null);
  }

  handlePageClicked(pageClicked: Page) {
    const editor = document.getElementById("editor");
    if (editor === null) { 
        return; 
    }
    this.bookService.retrieveEditorContent()

    const page = this.bookService.bookSelected()?.pages![pageClicked.index];

    if (page && typeof page.content === 'string') {
      
      this.bookService.selectPage(page);

      editor.innerHTML = page.content;
    }
  }

  handleClickBack() {
    if (this.bibliothek.parentFolderId) {
      this.dataservice.getFolder(this.bibliothek.parentFolderId).subscribe({
        next: (data) => {
          if (isFolder(data[0]))
          this.bibliothek = data[0];
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
        if (isFolder(data[0])) {
          this.bibliothek = data[0];
        } 
        
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

      this.bookFormUpload = this.fb.group({
        format: ['', Validators.required],
        padding: ['', Validators.required]
      });
    }

}
