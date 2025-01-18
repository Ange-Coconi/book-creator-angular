import { Component, OnInit } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Router, RouterOutlet } from '@angular/router';
import { BookService } from './book.service';
import { ViewService } from './view.service';
import { Page } from './models/page.model';
import { Book, folderOrganisator } from './models';

@Component({
  selector: 'app-root',
  imports: [ MainLayoutComponent, RouterOutlet],
  template: `
    <main [class]="backgroundClass">
      <app-main-layout class="fixed top-0 left-0 w-full h-14"/>
      <router-outlet ></router-outlet>
    </main>
  `,
  styles: `

  .dashboard-background {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: url('src/app/assets/bg-dashboard.jpg') no-repeat center center fixed;
    background-size: cover;
  }

  .default-background {
    top: 0;
    left: 0;
    width: calc(100vw - 17px);
    height: 100vh;
    min-height: 100vh;
  }
  `,
})
export class AppComponent implements OnInit {
  title = 'book-creator-angular';
  backgroundClass: string = '';

  constructor(public bookService: BookService, public viewService: ViewService, private router: Router) {
    this.router.events.subscribe(() => {
      // Set the background class based on the current route
      this.backgroundClass = this.getBackgroundClass(this.router.url);
    });
  }

  getBackgroundClass(route: string): string {
    switch (route) {
      case '/':
        return 'dashboard-background';
      case '/creation-book':
        return 'default-background';
      case '/contact':
        return 'default-background';
      default:
        return 'default-background';
    }
  }

  ngOnInit() {
      const library: folderOrganisator = {
        books: [
          new Book("The Great Gatsby", "root"),
          // new Book("1984", "root"),
          // new Book("Pride and Prejudice", "root"),
          // new Book("To Kill a Mockingbird", "root"),
          // new Book("The Catcher in the Rye", "root"),
        ],
        folders: []
      };
      library.books[0]._pages.push(new Page(0, 'page 1 page 1 page 1 page 1', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(1, 'page 2 page 2 page 2 page 2', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(2, 'page 3 page 3 page 3 page 3', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(3, 'page 4 page 4 page 4 page 4', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(4, 'page 5 page 5 page 5 page 5', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(5, 'page 1 page 1 page 1 page 1', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(6, 'page 2 page 2 page 2 page 2', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(7, 'page 3 page 3 page 3 page 3', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(8, 'page 4 page 4 page 4 page 4', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(9, 'page 5 page 5 page 5 page 5', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(10, 'page 1 page 1 page 1 page 1', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(11, 'page 2 page 2 page 2 page 2', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(12, 'page 3 page 3 page 3 page 3', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(13, 'page 4 page 4 page 4 page 4', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(14, 'page 5 page 5 page 5 page 5', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(15, 'page 1 page 1 page 1 page 1', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(16, 'page 2 page 2 page 2 page 2', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(17, 'page 3 page 3 page 3 page 3', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(18, 'page 4 page 4 page 4 page 4', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(19, 'page 5 page 5 page 5 page 5', "The Great Gatsby"))
      library.books[0]._pages.push(new Page(20, 'page 5 page 5 page 5 page 5', "The Great Gatsby"))
      
      // Create and populate folders
      // const classics = new Folder("Classics", "root");
      // classics.addBook(new Book("Moby Dick", "Classics"));
      // classics.addBook(new Book("Don Quixote", "Classics"));
      // classics.addBook(new Book("War and Peace", "Classics"));
      
      // const sciFi = new Folder("Science Fiction", "root");
      // sciFi.addBook(new Book("Dune", "Science Fiction"));
      // sciFi.addBook(new Book("Foundation", "Science Fiction"));
      // sciFi.addBook(new Book("Neuromancer", "Science Fiction"));
      
      // const mystery = new Folder("Mystery", "root");
      // mystery.addBook(new Book("The Maltese Falcon", "Mystery"));
      // mystery.addBook(new Book("The Big Sleep", "Mystery"));
      // mystery.addBook(new Book("Gone Girl", "Mystery"));
      
      // const fantasy = new Folder("Fantasy", "root");
      // fantasy.addBook(new Book("The Hobbit", "Fantasy"));
      // fantasy.addBook(new Book("A Game of Thrones", "Fantasy"));
      // fantasy.addBook(new Book("The Name of the Wind", "Fantasy"));
      
      // const contemporary = new Folder("Contemporary", "root");
      // contemporary.addBook(new Book("The Alchemist", "Contemporary"));
      // contemporary.addBook(new Book("The Kite Runner", "Contemporary"));
      // contemporary.addBook(new Book("Life of Pi", "Contemporary"));
      
      // // Add folders to the library
      // library.folders.push(classics, sciFi, mystery, fantasy, contemporary);
  
      this.bookService.bibliothek.set({...library});
      this.bookService.actualDisplay.set({...library});
      
    }

   
}
