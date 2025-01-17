import { Component, OnDestroy, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { BookService } from '../../book.service';
import { BookPageComponent } from '../book-page/book-page.component';
import { ViewService } from '../../view.service';
import { CommonModule } from '@angular/common';
import { PageSwallow } from '../../models/page-swallow.model';
import { PageRectoVerso } from '../../models/page-recto-verso.model';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-view-book',
  imports: [BookPageComponent, CommonModule],
  template: `
    <div id="bookContainer" class="w-[800px] h-[600px] mt-4 m-auto flex justify-end items-center">
      <div #book id="book" class="relative h-96 w-72"  style="margin-right: calc((800px - 2 * 288px) / 2)">
        <span class="shadow-lg absolute bottom-0 w-80 -rotate-6"></span>
        <div id="back" class="back absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 scale-102 border-2 border-black bg-[--dark-color]"></div>
        @for (page of viewService.reversedPageListRectoVerso(); track page.index) {
          <app-book-page 
          [id]="'page-' + page.index.toString()"
          class="page absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000"
          [ngClass]="'page-' + page.index.toString()"
          [data]="page"
          />
        }
        <div id="cover" class="absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 scale-103 -rotate-[4] border-2 border-black bg-[--dark-color]"></div>
      </div>
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
export class ViewBookComponent implements OnInit, OnDestroy {

  ngOnInit(): void {

    const pageSwallowDefault: PageSwallow= {_id: '', _name: '', _index: 0, _content: '', _parent: ''}

    this.viewService.lisfOfPage().forEach(page => {
      if (page._index % 2 === 0) {
        const pageRectoVerso: PageRectoVerso = {
          index: page._index / 2,
          recto: {...page},
          verso: {...pageSwallowDefault}
        }
        this.viewService.pageListRectoVerso().push(pageRectoVerso);

      } else {
        this.viewService.pageListRectoVerso()[Math.floor(page._index / 2)].verso = {...page};
      }
  })

    this.viewService.reversedPageListRectoVerso.set(this.viewService.pageListRectoVerso().slice().reverse().map(pageRectoVerso => {
      return {
        index : pageRectoVerso.index,
        recto: {...pageRectoVerso.recto},
        verso: {...pageRectoVerso.verso}
      }   
    }));
    this.viewService.numberOfPage.set(this.viewService.reversedPageListRectoVerso().length);
  } 

  ngOnDestroy(): void {
      this.viewService.pageListRectoVerso.set([]);
      this.viewService.reversedPageListRectoVerso.set([]);
      this.viewService.numberOfPage.set(0);
  }

  constructor (public bookService: BookService, public viewService: ViewService, public renderer: Renderer2) {}

}
