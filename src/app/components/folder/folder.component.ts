import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Folder } from '../../models/folder.model';

@Component({
  selector: 'app-folder',
  imports: [],
  template: `
    <button class="w-full flex justify-left items-center shadow-md hover:opacity-80" (click)="folderClicked.emit(folder)">
      <svg class="ml-3.5 fill-white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50"><path d="M 5 3 C 3.3545455 3 2 4.3545455 2 6 L 2 10 L 2 16 L 2 27 L 2 40 L 2 44 C 2 45.645455 3.3545455 47 5 47 L 44 47 C 45.645455 47 47 45.645455 47 44 L 47 27 L 47 16 L 47 10 C 47 8.3545455 45.645455 7 44 7 L 18 7 C 18.06944 7 17.95032 6.99708 17.705078 6.7167969 C 17.459833 6.4365165 17.160156 5.9707031 16.847656 5.4707031 C 16.535156 4.9707031 16.209833 4.4365165 15.798828 3.9667969 C 15.387823 3.4970773 14.819444 3 14 3 L 5 3 z M 5 5 L 14 5 C 13.93056 5 14.04968 5.00292 14.294922 5.2832031 C 14.540167 5.5634835 14.839844 6.0292969 15.152344 6.5292969 C 15.464844 7.0292969 15.790167 7.5634835 16.201172 8.0332031 C 16.612177 8.5029227 17.180556 9 18 9 L 44 9 C 44.554545 9 45 9.4454545 45 10 L 45 13.1875 C 44.685079 13.07397 44.351946 13 44 13 L 5 13 C 4.6480538 13 4.3149207 13.07397 4 13.1875 L 4 10 L 4 6 C 4 5.4454545 4.4454545 5 5 5 z M 5 15 L 44 15 C 44.554545 15 45 15.445455 45 16 L 45 27 L 45 44 C 45 44.554545 44.554545 45 44 45 L 5 45 C 4.4454545 45 4 44.554545 4 44 L 4 40 L 4 27 L 4 16 C 4 15.445455 4.4454545 15 5 15 z"></path></svg>
      <p class="ml-5 block text-center text-white px-2 py-2" >{{name}}</p>
    </button>
  `,
  styles: ``
})
export class FolderComponent {
  @Input() 
  folder!: Folder ;

  @Output() 
  folderClicked = new EventEmitter<Folder>();
  
  get id(): number {
    return this.folder.id;
  }

  get name(): string {
    return this.folder.name;
  }
}
