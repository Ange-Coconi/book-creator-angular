import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Folder } from '../../models';

@Component({
  selector: 'app-folder',
  imports: [],
  template: `
    <p>
    <button class="block text-center text-red-600 px-2 py-2" (click)="folderClicked.emit(name)">{{name}}</button>
    </p>
  `,
  styles: ``
})
export class FolderComponent {
  @Input() 
  folder!: Folder ;

  @Output() 
  folderClicked = new EventEmitter<string>();
  
  get id(): string {
    return this.folder.id;
  }

  get name(): string {
    return this.folder.name;
  }
}
