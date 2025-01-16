import { Component } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { BookService } from '../../book.service';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent, TextEditorComponent, ToolbarComponent],
  template: `
    <div class="relative top-14 grid-container">
      <app-bibliothek class="sidebar"/>
      @if (this.bookService.bookSelected() !== null) {
        <app-text-editor class="editor"/>
        <app-toolbar class="sidebar-right"/>
      }
      
      @if (this.bookService.windowCreationNewBook()) {
          <div class="fixed w-full h-full top-0 left-0 z-20 bg-slate-900/75">
            <form id="windowTitle" (submit)="this.bookService.handleSubmitTitle($event)" class="fixed top-1/3 left-1/3 w-2/6 h-2/6 z-30 border rounded-xl flex flex-col justify-center items-center">
              <label class="mb-2 text-xl" for="title">Title</label>
              <input class="mb-12 w-96 px-2 py-1 text-black" type="text" id="title" name="title" required/>
              <button class="text-lg px-4 py-2 border rounded-md shadow-md hover:opacity-80" type="submit">ok</button>
            </form>
          </div>
        }
    </div>  
  `, 
  styles: `
  .grid-container {
    display: grid;
    grid-template-areas: 
      "sidebar editor sidebar-right";
    grid-template-columns: 1fr 5fr 1fr; /* Zwei Spalten: 1 Teil Sidebar, 3 Teile Content */
    grid-template-rows: 1fr; /* Automatische Höhe für Header und Footer */
    width: 100%;
    max-width: 100% !important;
    height: calc(100% - 56px);
  }

  .sidebar {
    grid-area: sidebar;
  }

  .editor {
    grid-area: editor;
    }

  .sidebar-right {
    grid-area: sidebar-right;
  }
  `
})
export class CreationBookComponent {


  constructor (public bookService: BookService) {}

}
