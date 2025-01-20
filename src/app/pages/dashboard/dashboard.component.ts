import { Component, OnInit } from '@angular/core';
import { BookService } from '../../book.service';
import { ViewService } from '../../view.service';
import { BookDashboardComponent } from '../../components/book-dashboard/book-dashboard.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-dashboard',
  imports: [BookDashboardComponent, CommonModule],
  template: `
    <div *ngIf="isReady" class="main-container relative top-14 z-0 ">
      <div class="previsualization flex justify-center items-center">
        <div class="grid grid-cols-3 grid-rows-2 p-8 rounded-lg bg-slate-900/75 text-white overflow-hidden">
          @for (book of bookDashboard; track book.id) {
            <app-book-dashboard [book]="book"/>
          }
        </div>
      </div>
      <div class="introduction flex justify-center items-center">
        <div class="w-4/6 h-5/6 flex flex-col justify-center items-center rounded-lg bg-slate-900/75 text-white">
          <h2 class="m-2 text-xl font-bold">Transform Your Words into a Book</h2>
          <p class="m-4">
            Our web app allows you to write your story in an easy-to-use text editor, then 
            instantly visualize it as a book. See your content as it would appear on pages, 
            with realistic 3D page-flipping effects that bring your work to life.
          </p>
          <p class="m-4">
            From the first draft to the final page, you can create and format your book in 
            a dynamic environment. Experience the look and feel of your book with both the recto 
            and verso pages, all while adjusting layouts and adding depth for a realistic touch.
          </p>
          <p class="m-4">
            Whether you're an author, a designer, or a storyteller, our app lets you craft 
            your book and see it in action. Write. Visualize. Create. Your story, perfectly 
            presented.
          </p>

        </div>
      </div>  
    </div>
  `,
  styles: `
    .main-container {
      display: grid;
      grid-template-areas: 
        "previsualization introduction";
      grid-template-columns: 4fr 3fr; /* Zwei Spalten: 1 Teil Sidebar, 3 Teile Content */
      grid-template-rows: 1fr; /* Automatische Höhe für Header und Footer */

      height: calc(100% - 56px);

    }
    
    .previsualization {
      grid-area: previsualization;
    }

    .introduction {
      grid-area: introduction;
      }

  `
})
export class DashboardComponent implements OnInit {
  isReady = false;
  bookDashboard: Book[] = []

  ngOnInit() {

    this.dataservice.getBibliothek().subscribe({
      next: (data) => {
        this.bookDashboard = data;
      },
      error: (error) => {
        console.error('Error fetching books dashboard: ', error);
      }
    });

    setTimeout(() => {
      this.isReady = true;
    }, 20); // Adjust delay as needed

    

  }

  constructor (public bookService: BookService, public viewService: ViewService, public dataservice: DataService) {}
}
