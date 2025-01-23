import { AfterViewInit, Component, Input, OnDestroy, OnInit, Renderer2, signal, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { BookService } from '../../book.service';
import { BookPageComponent } from '../book-page/book-page.component';
import { ViewService } from '../../view.service';
import { CommonModule } from '@angular/common';
import { PageRectoVerso } from '../../models/page-recto-verso.model';
import { Page } from '../../models/page.model';

@Component({
  selector: 'app-view-book',
  imports: [BookPageComponent, CommonModule],
  template: `
    <div id="bookContainer" class=" mt-4 m-auto flex justify-end items-center">
      <div class="containerFor3D">
      <div 
        id="book" 
        class="shadow preserve3D relative" 
        [style.marginRight]="marginRight()"
        [style.width]="bookWidth()"
        [style.height]="bookHeight()"
        >
        <div 
          id="cover" 
          class="absolute w-full h-full top-0 left-0 origin-left transition-transform duration-2000 border-2 rounded-r border-black bg-orange-800"
          [style.zIndex]="viewService.numberOfPage() * 5 + 10"
          >
        </div>

        @for (page of viewService.pageListRectoVerso(); track page.index) {
          <app-book-page 
          [id]="'page-' + page.index.toString()"
          class="page preserve3D absolute w-[96%] h-[96%] top-[2%] left-0 origin-left transition-transform duration-2000 text-justify"
          [ngClass]="'page-' + page.index.toString()"
          [style.zIndex]="(viewService.numberOfPage() - page.index + 1) * 5"
          [ngStyle]="{
            'margin-left' : page.index / 2 + 'px'
          }"
          [style.width]="width()"
          [style.height]="height()"
          [style.padding]="px() + ' ' + py()" 
          [style.fontSize]="fontSize()"
          [style.lineHeight]="lineHeight()"
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
export class ViewBookComponent implements OnInit, OnDestroy, AfterViewInit {
  bookWidth = signal<string>('');
  bookHeight = signal<string>('');
  baseBookWidth: string = '';
  baseBookHeight: string = '';

  withOfMyBookContainer: number = 1000;
  marginRight = signal<string>('');

  baseWidth: string = '';
  baseHeight: string = '';
  basePx: string = '';
  basePy: string = '';
  baseFontSize: string = '12px';
  baseLineHeight: string = `${12 * 1.4}px`;

  multiplicator: number = 1;

  width = signal<string>('');
  height = signal<string>('');
  px = signal<string>('');
  py = signal<string>('');
  fontSize = signal<string>('12px');
  lineHeight = signal<string>(`${12 * 1.4}px`);

  @Input()
  zoomPlusInfo!: boolean;
  
  @Input()
  zoomMinusInfo!: boolean;

  ngOnChanges(changes: SimpleChanges): void {

      if (changes['zoomPlusInfo'] && !changes['zoomPlusInfo'].firstChange) {
        this.handleZoomPlus()
      }

      if (changes['zoomMinusInfo'] && !changes['zoomMinusInfo'].firstChange) {
        this.handleZoomMinus()
      }

  }

  ngAfterViewInit(): void {
      const bookContainer = document.getElementById('bookContainer');
      if (!bookContainer) return
      this.withOfMyBookContainer = bookContainer?.offsetWidth

      if (this.withOfMyBookContainer) {

        const bookWithPX = Math.floor(parseInt(this.bookWidth(), 10) * 3.7795275591)

        const marginRight = ((this.withOfMyBookContainer - 2 * bookWithPX) / 2).toFixed(0);
        this.marginRight.set(`${marginRight}px`)
       
      }
  }

  handleZoomPlus() {
    if (this.multiplicator > 1.6) return

    this.multiplicator += 0.1

    const newWidth = (this.multiplicator * parseInt(this.baseWidth, 10)).toFixed(1);
    this.width.set(`${newWidth}mm`);

    const newHeight = (this.multiplicator * parseInt(this.baseHeight, 10)).toFixed(1);
    this.height.set(`${newHeight}mm`);

    const newPx = (this.multiplicator * parseInt(this.basePx, 10)).toFixed(1);
    this.px.set(`${newPx}px`);

    const newPy = (this.multiplicator * parseInt(this.basePy, 10)).toFixed(1);
    this.py.set(`${newPy}px`);

    const newFontSize = (this.multiplicator * parseInt(this.baseFontSize, 10)).toFixed(2);
    this.fontSize.set(`${newFontSize}px`);

    const newLineHeight = (this.multiplicator * parseInt(this.baseLineHeight, 10)).toFixed(2);
    this.lineHeight.set(`${newLineHeight}px`);

    const newBaseWidth = (this.multiplicator * parseInt(this.baseBookWidth, 10)).toFixed(1);
    this.bookWidth.set(`${newBaseWidth}mm`);
  
    const newBaseHeight = (this.multiplicator * parseInt(this.baseBookHeight, 10)).toFixed(1);
    this.bookHeight.set(`${newBaseHeight}mm`);

    const bookWithPX = Math.floor(parseInt(this.bookWidth(), 10) * 3.7795275591)

    const marginRight = ((this.withOfMyBookContainer - 2 * bookWithPX) / 2).toFixed(0);
    this.marginRight.set(`${marginRight}px`)

  }
  
  handleZoomMinus() {
    if (this.multiplicator < 0.4) return
  
    this.multiplicator -= 0.1
    console.log(this.multiplicator)
    console.log((this.multiplicator * parseInt(this.baseFontSize, 10)).toFixed(2))
    const newWidth = (this.multiplicator * parseInt(this.baseWidth, 10)).toFixed(1);
    this.width.set(`${newWidth}mm`);
  
    const newHeight = (this.multiplicator * parseInt(this.baseHeight, 10)).toFixed(1);
    this.height.set(`${newHeight}mm`);
  
    const newPx = (this.multiplicator * parseInt(this.basePx, 10)).toFixed(1);
    this.px.set(`${newPx}px`);
  
    const newPy = (this.multiplicator * parseInt(this.basePy, 10)).toFixed(1);
    this.py.set(`${newPy}px`);
  
    const newFontSize = (this.multiplicator * parseInt(this.baseFontSize, 10)).toFixed(2);
    this.fontSize.set(`${newFontSize}px`);

    console.log(this.fontSize())
  
    const newLineHeight = (this.multiplicator * parseInt(this.baseLineHeight, 10)).toFixed(2);
    this.lineHeight.set(`${newLineHeight}px`);

    const newBaseWidth = (this.multiplicator * parseInt(this.baseBookWidth, 10)).toFixed(1);
    this.bookWidth.set(`${newBaseWidth}mm`);
  
    const newBaseHeight = (this.multiplicator * parseInt(this.baseBookHeight, 10)).toFixed(1);
    this.bookHeight.set(`${newBaseHeight}mm`);

    const bookWithPX = Math.floor(parseInt(this.bookWidth(), 10) * 3.7795275591)

    const marginRight = ((this.withOfMyBookContainer - 2 * bookWithPX) / 2).toFixed(0);
    this.marginRight.set(`${marginRight}px`)

  }

  ngOnInit(): void {

    const bookSelected = this.bookService.bookSelected();
    
    if (!bookSelected) return

    if (bookSelected.format === 'big') {
      this.width.set('210mm');
      this.height.set('297mm');
      this.baseWidth = '210mm';
      this.baseHeight = '297mm';
      this.bookWidth.set(`${210 / 0.96}mm`);
      this.bookHeight.set(`${297 / 0.96}mm`);
      this.baseBookWidth = `${210 / 0.96}mm`;
      this.baseBookHeight = `${297 / 0.96}mm`;
    } else if (bookSelected.format === 'medium') {
      this.width.set('148mm');
      this.height.set('210mm');
      this.baseWidth = '148mm';
      this.baseHeight = '210mm';
      this.bookWidth.set(`${148 / 0.96}mm`);
      this.bookHeight.set(`${210 / 0.96}mm`);
      this.baseBookWidth = `${148 / 0.96}mm`;
      this.baseBookHeight = `${210 / 0.96}mm`;
    } else if (bookSelected.format === 'small') {
      this.width.set('105mm');
      this.height.set('148mm');
      this.baseWidth = '105mm';
      this.baseHeight = '148mm';
      this.bookWidth.set(`${105 / 0.96}mm`);
      this.bookHeight.set(`${148 / 0.96}mm`);
      this.baseBookWidth = `${105 / 0.96}mm`;
      this.baseBookHeight = `${148 / 0.96}mm`;
    }

    if (bookSelected.padding === 'big') {
      this.px.set('20px');
      this.py.set('30px');
      this.basePx = '20px';
      this.basePy = '30px';
    } else if (bookSelected.padding === 'medium') {
      this.px.set('10px');
      this.py.set('20px');
      this.basePx = '10px';
      this.basePy = '20px';
    } else if (bookSelected.padding === 'small') {
      this.px.set('5px');
      this.py.set('10px');
      this.basePx = '5px';
      this.basePy = '10px';
    }

    const pageDefault: Page = {index: 0, content: '', bookId: this.bookService.bookSelected()!.id}

    console.log(this.viewService.lisfOfPage());

    this.viewService.lisfOfPage().forEach(page => {
      if (page.index % 2 === 0) {
        const pageRectoVerso: PageRectoVerso = {
          index: page.index / 2,
          recto: {...page},
          verso: {...pageDefault}
        }
        this.viewService.pageListRectoVerso().push(pageRectoVerso);
        console.log(this.viewService.pageListRectoVerso())

      } else {
        this.viewService.pageListRectoVerso()[Math.floor(page.index / 2)].verso = {...page};
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
