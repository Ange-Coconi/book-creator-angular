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
    <div id="bookContainer" class="w-[1100px] h-[600px] mt-4 m-auto flex justify-end items-center">
      <div class="containerFor3D">
      <div id="book" class="shadow preserve3D relative h-[550px] w-[400px]" style="margin-right: calc((800px - 2 * 288px) / 2)">
        <div 
          id="cover" 
          class="absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 border-2 rounded-r border-black bg-orange-800"
          [style.zIndex]="viewService.numberOfPage() * 5 + 10"
          >
        </div>

        @for (page of viewService.pageListRectoVerso(); track page.index) {
          <app-book-page 
          [id]="'page-' + page.index.toString()"
          class="page preserve3D absolute w-[96%] h-[96%] top-[2%] left-0 origin-left transition-transform duration-2000 "
          [ngClass]="'page-' + page.index.toString()"
          [style.zIndex]="(viewService.numberOfPage() - page.index + 1) * 5"
          [ngStyle]="{
            'margin-left' : page.index / 2 + 'px'
          }"
          [data]="page"
          />
        }
        <span class="shadow-lg absolute bottom-0 w-80 -rotate-6 z-[5]"></span>
        <div 
          id="back" 
          class="back absolute w-full h-full top-0 left-0 z-[5] origin-left transition-transform duration-2000 border-2 rounded-r border-black bg-orange-800"
          >
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .page {
      background: linear-gradient(to right, var(--subtle-color), 20%, var(--main-color));
      border: 1px solid black;
    }

    #bookContainer {
      perspective: 2000px;
      perspective-origin: 50% 50%;
    }

    .containerFor3D {
      transform-style: preserve-3d;
      transform: rotateX(5deg) rotateY(-5deg) translateZ(10px);
      transition: transform 1s ease;
    }

    .preserve3D {
      transform-style: preserve-3d;
    }

    .shadow {
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.7);
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
    this.viewService.numberOfPage.set(this.viewService.pageListRectoVerso().length)
    this.viewService.zIndexStackRight.set(this.viewService.numberOfPage() * 5 + 10)
    console.log(this.bookService.bookSelected())
  } 

  ngOnDestroy(): void {
      this.viewService.pageListRectoVerso.set([]);

      this.viewService.numberOfPage.set(0);

      if (this.viewService.boxShadowTimeout) {
        clearTimeout(this.viewService.boxShadowTimeout);
      }
  }

  constructor (public bookService: BookService, public viewService: ViewService, public renderer: Renderer2) {}

}
