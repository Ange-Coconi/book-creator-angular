import { AfterViewInit, Component, OnDestroy} from '@angular/core';
import { BookService } from '../../book.service';


@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [],
  template: `
  <div class="w-full h-full max-w-full mt-2 mb-2 ml-[9%] flex flex-col justify-center items-center" >
    <div class="containerEditor">
        <div 
          id="editor" 
          contenteditable="true" class="w-full h-full block p-4 border-slate-900/75 rounded-lg bg-white text-xs" 
          (change)="this.bookService.checkOverflow()"
          >
        </div>
    </div>
    
  </div>
  `,
  styles: `
  .containerEditor {
    width: 40vw;
    max-width: 40vw;
    height: 120vh;
    max-height: 120vh;
    
  }

  [contenteditable="true"]:focus {
    outline: none; /* Or any subtle style */
  } 
  `
})
export class TextEditorComponent implements AfterViewInit {

  ngAfterViewInit() {
    const editor = document.getElementById("editor");
    const bookSelected = this.bookService.bookSelected();
  
    if (!editor) {
      console.error('Editor element not found');
      return;
    }
  
    if (!bookSelected) {
      console.error('No book selected');
      return;
    }
  
    const pages = bookSelected.pages;
    if (!pages) {
      console.error('No pages found in the selected book');
      return;
    }
  
    const pagesLength = pages.length;
    if (pagesLength > 0) {
      editor.innerHTML = pages[0].content || '';
    } else {
      const newPage = { index: pagesLength, content: '', bookId: bookSelected.id };
  
      if (newPage.bookId !== undefined) {
        this.bookService.selectPage(newPage);
      } else {
        console.error('New page has undefined bookId');
      }
    }
  }
  

  constructor (public bookService: BookService) {}
}

