import { Component, Input, OnInit } from '@angular/core';
import { BibliothekComponent } from '../../components/bibliothek/bibliothek.component';
import { TextEditorComponent } from '../../components/text-editor/text-editor.component';
import { BookService } from '../../book.service';
import { ToolbarComponent } from "../../components/toolbar/toolbar.component";
import { ViewBookComponent } from "../../components/view-book/view-book.component";
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-creation-book',
  imports: [BibliothekComponent, TextEditorComponent, ToolbarComponent, ViewBookComponent],
  template: `
    <app-bibliothek class=""/>
    <div class="background"></div>
    <div class="relative top-14 grid-container">
      
      @if (this.bookService.bookSelected() !== null) {
        @if (bookService.viewBook()) {
          <app-view-book class="editor" [zoomMinusInfo]="zoomMinusInfo" [zoomPlusInfo]="zoomPlusInfo"/>
        } @else {
          <app-text-editor class="editor" [zoomMinusInfo]="zoomMinusInfo" [zoomPlusInfo]="zoomPlusInfo"/>
        }
        <app-toolbar 
        class="sidebar-right"
        (zoomPlus)="zoomPlusClicked()"
        (zoomMinus)="zoomMinusClicked()"
        />
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
export class CreationBookComponent implements OnInit {
  zoomPlusInfo: boolean = false;
  zoomMinusInfo: boolean = false;
  errorTimeout: any;

  zoomPlusClicked() {
    this.zoomPlusInfo = !this.zoomPlusInfo;
  }

  zoomMinusClicked() {
    this.zoomMinusInfo = !this.zoomMinusInfo;
  }

  constructor (public bookService: BookService, public dataservice: DataService, public authService: AuthService) {}

  ngOnInit(): void {
    this.authService.session().subscribe({
      next: (data) => {
        console.log(data)
        this.authService.userData.set(data);

      },
      error: (error) => {
        console.error('Error session : ', error);

      }
    });
  }
  
}
