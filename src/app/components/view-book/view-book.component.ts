import { Component, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { BookService } from '../../book.service';
import { BookPageComponent } from '../book-page/book-page.component';
import { Page } from '../../models/page.model';
import { ViewService } from '../../view.service';
import { CommonModule } from '@angular/common';
import { PageSwallow } from '../../models/page-swallow.model';
import { PageRectoVerso } from '../../models/page-recto-verso.model';

@Component({
  selector: 'app-view-book',
  imports: [BookPageComponent, CommonModule],
  template: `
    <div id="bookContainer" class="w-[800px] h-[600px] mt-4 m-auto flex justify-end items-center">
      <div #book id="book" class="relative h-96 w-72"  style="margin-right: calc((800px - 2 * 288px) / 2)">
        <span class="shadow-lg absolute bottom-0 w-80 -rotate-6"></span>
        <div id="back" class="back absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 scale-102 border-2 border-black bg-[--dark-color]"></div>
        @for (page of reversedPageList; track page._id) {
          <app-book-page 
          [id]="'page-' + page._index.toString()"
          class="page absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000"
          [ngClass]="'page-' + page._index.toString()"
          [data]="page"
          />
        }
        <div id="cover" class="absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 scale-103 -rotate-[4] border-2 border-black bg-[--dark-color]"></div>
      </div>
      @if (false) {<app-book-page/>}
    </div>
  `,
  styles: `
    #bookContainer {
      perspective: 2000px;
      perspective-origin: 50% 50%;
      border: red 2px solid;
    }

    #book {
      transform-style: preserve-3d;
    }

    .page {
      background: linear-gradient(to right, var(--subtle-color), 20%, var(--main-color));
      border: 1px solid black;
    }
  `
})
export class ViewBookComponent implements OnInit {

  reversedPageList: Array<PageSwallow> = [];
  reversedPageListRectoVerso: Array<PageRectoVerso> = [];

  ngOnInit(): void {
    this.reversedPageList = this.viewService.ListOfPage().slice().reverse().map(item => ({ ...item }));

    const pageSwallowDefault: PageSwallow= {_id: '', _name: '', _index: 0, _content: '', _parent: ''}
    this.reversedPageList.forEach(page => {
      if (page._index % 2 === 0) {
        const pageRectoVerso = {
          index: page._index / 2,
          recto: {...page},
          verso: {...pageSwallowDefault}
        }
        this.reversedPageListRectoVerso.push(pageRectoVerso);
      } else {
        this.reversedPageListRectoVerso[Math.floor(page._index / 2)].verso = {...page};
      }
    })


  } 

  constructor (public bookService: BookService, public viewService: ViewService, public renderer: Renderer2) {}

}
