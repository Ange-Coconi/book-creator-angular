import { Component } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { BookService } from '../../book.service';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { ViewBookComponent } from "../../components/view-book/view-book.component";

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent, TextEditorComponent, ToolbarComponent, ViewBookComponent],
  template: `
    <app-bibliothek class=""/>
    <div class="background"></div>
    <div class="relative top-14 grid-container">
      
      @if (this.bookService.bookSelected() !== null) {
        @if (bookService.viewBook()) {
          <app-view-book class="editor"/>
        } @else {
          <app-text-editor class="editor"/>
        }
        <app-toolbar class="sidebar-right"/>
      }
      
      @if (this.bookService.windowCreationNewBook() || this.bookService.windowCreationFolder()) {
          <div class="fixed w-full h-full top-0 left-0 z-[52] bg-slate-900/75 text-white">
            <form 
              id="windowTitle" 
              (submit)="this.bookService.windowCreationNewBook() ? this.bookService.handleSubmitTitle($event) : this.bookService.handleSubmitName($event)" 
              class="fixed top-1/3 left-1/3 w-2/6 h-2/6 z-[55] border rounded-xl flex flex-col justify-center items-center">
              <label class="mb-2 text-xl" for="title">{{this.bookService.windowCreationNewBook() ? "Title" : "Name"}}</label>
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
      "editor sidebar-right";
    grid-template-columns: 6fr 1fr; /* Zwei Spalten: 1 Teil Sidebar, 3 Teile Content */
    grid-template-rows: 1fr; /* Automatische Höhe für Header und Footer */
    width: 100%;
    max-width: 100%;
    height: calc(100% - 56px);
    min-height: calc(100% - 56px);
  }

  .editor {
    grid-area: editor;
    }

  .sidebar-right {
    grid-area: sidebar-right;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    z-index: -50;
    background: url('src/app/assets/bg-dashboard.jpg') no-repeat center center fixed;
    background-size: cover;   
  }
  `
})
export class CreationBookComponent {


  constructor (public bookService: BookService) {}

}
