import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PageRectoVerso } from '../../models/page-recto-verso.model';
import { ViewService } from '../../view.service';
import { BookService } from '../../book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-page',
  imports: [CommonModule],
  template: `
      <div 
        [id]="'page-' + data.index.toString() + '-content'"
        class="page-leaf"
        [style]="'backface-visibility: hidden'"
        >
          <div 
              [id]="'page-' + data.index.toString() + '-recto'"
              class="absolute w-full h-full backface-hidden px-5 py-5 text-xs "
              [innerHTML]="data.recto._content"
              [style.zIndex]="(viewService.numberOfPage() - data.index + 1) * 5 + 1"
              [style]="'backface-visibility: hidden'"
              >
          </div>
          
          <div 
              [id]="'page-' + data.index.toString() + '-verso'"
              class="verso absolute w-full h-full px-5 py-5 text-xs "
              [innerHTML]="data.verso._content"
              [style.zIndex]="(viewService.numberOfPage() - data.index + 1) * 5 - 1"
              [ngStyle]="{
                'backface-visibility': 'hidden', 
                'transform': 'rotateY(180deg)'
                }"
              >
          </div>

      </div>
  `,
  styles: `
    .page-leaf {
      transform-style: preserve-3d;
      position: relative;
    }

    .verso {
      transform: rotateY(180deg);
    }
  `
})
export class BookPageComponent {
  @Input()
  data!: PageRectoVerso;

  // ngAfterViewInit(): void {
  //   const pageHTML = document.getElementById(`page-${this.data.index}-content`)
  //   console.log(`page-${this.data.index}-content`)
  //   console.log(pageHTML)
  //   if (pageHTML === null) return
  //   pageHTML.innerHTML = this.data.recto._content;
  //   console.log(pageHTML)
  // }
  constructor (public bookService: BookService, public viewService: ViewService) {}

}
