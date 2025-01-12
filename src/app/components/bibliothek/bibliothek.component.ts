import { Component } from '@angular/core';
import { File, Book, Folder } from '../../models/index';
import { BookComponent } from '../../components/book/book.component';
import { TITLE_TOKEN } from '../../components/book/book.component';
import { FolderComponent } from '../../components/folder/folder.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule],
  providers: [ 
    { provide: TITLE_TOKEN, useValue: 'Parent Provided Title' }
  ],
  template: `
    <div class="fixed top-12 left-0 w-1/5 h-full bg-slate-900 text-white">
      <h2>Library</h2>
      <ng-container *ngFor="let item of bibliothek; let index = index">
        <app-book *ngIf="isBook(item)"></app-book>
        <app-folder *ngIf="!isBook(item)"></app-folder>
      </ng-container>  
    </div>
  `,
  styles: ``
})
export class BibliothekComponent {
  bibliothek: Array<File> = new Array<File>();

  isBook(item: File): boolean {
    return (item as Book).title !== undefined;
  }
}
