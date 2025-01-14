import { Component } from '@angular/core';
import { Item, Book, Folder, folderOrganisator } from '../../models';
import { BookComponent } from '../../components/book/book.component';
import { FolderComponent } from '../../components/folder/folder.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bibliothek',
  imports: [BookComponent, FolderComponent, CommonModule],
  providers: [],
  template: `
    <div class="fixed top-14 left-0 w-72 h-full bg-slate-900/75 text-white">
      <h2 class="mb-1">Library</h2>
      @if (this.prev !== null) {
        <button class="block" (click)="handleClickBack()">Back</button>
      }
      @for (folder of actualDisplay.folders; track folder.id) {
        <app-folder [folder]="folder" (folderClicked)="handleFolderClicked($event)" />
      }
      @for (book of actualDisplay.books; track book.id) {
      <app-book [book]="book" (bookClicked)="handleBookClicked()"/>
      }
      
    </div>
  `,
  styles: ``
})
export class BibliothekComponent {
  _bibliothek: folderOrganisator = { books: [], folders: []};
  _actualDisplay: folderOrganisator = { books: [], folders: []};
  _prev: Folder | string | null = null;

  handleClickBack() {
    if (this.prev instanceof Folder) {
      this.actualDisplay = this.prev.items;
    } else if (this.prev === "root") {
      this.actualDisplay = this.bibliothek;
      this.prev = null;
    }
  }

  handleBookClicked() {

  }

  handleFolderClicked(event: string) {
    
    const indexFolderToDisplay = this.bibliothek.folders.findIndex(folder => folder.name === event);
    this.actualDisplay = this.bibliothek.folders[indexFolderToDisplay].items;
    this.prev = this.bibliothek.folders[indexFolderToDisplay]._parent;
  }

  ngOnInit() {
    const library: folderOrganisator = {
      books: [
        new Book("The Great Gatsby", "root"),
        new Book("1984", "root"),
        new Book("Pride and Prejudice", "root"),
        new Book("To Kill a Mockingbird", "root"),
        new Book("The Catcher in the Rye", "root"),
      ],
      folders: []
    };
    
    // Create and populate folders
    const classics = new Folder("Classics", "root");
    classics.addBook(new Book("Moby Dick", "Classics"));
    classics.addBook(new Book("Don Quixote", "Classics"));
    classics.addBook(new Book("War and Peace", "Classics"));
    
    const sciFi = new Folder("Science Fiction", "root");
    sciFi.addBook(new Book("Dune", "Science Fiction"));
    sciFi.addBook(new Book("Foundation", "Science Fiction"));
    sciFi.addBook(new Book("Neuromancer", "Science Fiction"));
    
    const mystery = new Folder("Mystery", "root");
    mystery.addBook(new Book("The Maltese Falcon", "Mystery"));
    mystery.addBook(new Book("The Big Sleep", "Mystery"));
    mystery.addBook(new Book("Gone Girl", "Mystery"));
    
    const fantasy = new Folder("Fantasy", "root");
    fantasy.addBook(new Book("The Hobbit", "Fantasy"));
    fantasy.addBook(new Book("A Game of Thrones", "Fantasy"));
    fantasy.addBook(new Book("The Name of the Wind", "Fantasy"));
    
    const contemporary = new Folder("Contemporary", "root");
    contemporary.addBook(new Book("The Alchemist", "Contemporary"));
    contemporary.addBook(new Book("The Kite Runner", "Contemporary"));
    contemporary.addBook(new Book("Life of Pi", "Contemporary"));
    
    // Add folders to the library
    library.folders.push(classics, sciFi, mystery, fantasy, contemporary);

    this.bibliothek = {...library};
    this.actualDisplay = {...library};
  }

  get bibliothek(): folderOrganisator {
    return this._bibliothek;
  }

  set bibliothek(folderOrganisator: folderOrganisator) {
    this._bibliothek = folderOrganisator;
  }

  get actualDisplay(): folderOrganisator {
    return this._actualDisplay;
  }

  set actualDisplay(folderOrganisator: folderOrganisator) {
    this._actualDisplay = folderOrganisator;
  }

  get prev(): Folder | string | null{
    return this._prev;
  }

  set prev(previousFolder: Folder | string | null) {
    this._prev = previousFolder;
  }

}
