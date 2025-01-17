import { AfterViewInit, Component} from '@angular/core';
import { Book } from '../../models';
import { BookService } from '../../book.service';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [],
  template: `
  <div class="w-full h-full max-w-full mt-2 mb-2 flex flex-col justify-center items-center" >

    
    <div class="containerEditor">
        <div 
          id="editor" 
          contenteditable="true" class="w-full h-full block p-4 border-4 border-slate-900/75 overflow-y-scroll text-xs" 
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
  `
})
export class TextEditorComponent implements AfterViewInit {
    bookDefault = new Book("default", "root")

    ngAfterViewInit() {
        const editor = document.getElementById("editor");
        if (editor === null) { return }
        const numberOfPage = this.bookService.bookSelected()!._pages.length;
        if (numberOfPage > 0) {
            editor.innerHTML = this.bookService.bookSelected()!._pages[0]._content
        } else {
            const newPage = new Page(0, '', this.bookService.bookSelected()!.title);
            this.bookService.bookSelected()?.pages.push(newPage)
            this.bookService.selectPage(newPage);
        }
    }

    constructor (public bookService: BookService) {}
}

