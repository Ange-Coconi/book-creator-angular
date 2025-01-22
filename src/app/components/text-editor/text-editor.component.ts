import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges, ViewChild} from '@angular/core';
import { BookService } from '../../book.service';


@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [],
  template: `
  <div class="w-full h-full max-w-full mt-2 mb-2 ml-[9%] flex flex-col justify-center items-center" >
    <div class="containerEditor">
        <div 
          id="editor" 
          contenteditable="true"
          [style.width]="width()"
          [style.height]="height()"
          [style.padding]="px() + ' ' + py()" 
          [style.fontSize]="fontSize()"
          [style.lineHeight]="lineHeight()"
          class="block border-slate-900/75 rounded-lg bg-white text-xs" 
          (input)="checkOverflow($event)"
          >
        </div>
    </div>
    
  </div>
  `,
  styles: `
  .containerEditor {
    width: 40vw;
    max-width: 40vw;
    height: 120vh;
    max-height: 120vh;
    
  }

  [contenteditable="true"]:focus {
    outline: none; /* Or any subtle style */
  } 
  `
})
export class TextEditorComponent implements AfterViewInit, OnInit, OnChanges {
  @ViewChild('editor', { static: true }) editor!: ElementRef;
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

  checkOverflow(event: Event) {
    const editorElement = this.editor.nativeElement as HTMLElement;
    const maxWidth = editorElement.offsetWidth;
    const maxHeight = editorElement.offsetHeight;

    if (editorElement.scrollWidth > maxWidth || editorElement.scrollHeight > maxHeight) {
      const keyboardEvent = event as KeyboardEvent;
      keyboardEvent.preventDefault();
      event.preventDefault();
      return false;
    }
    return true
  }

  ngOnChanges(changes: SimpleChanges): void {

      if (changes['zoomPlusInfo'] && !changes['zoomPlusInfo'].firstChange) {
        this.handleZoomPlus()
      }

      if (changes['zoomMinusInfo'] && !changes['zoomMinusInfo'].firstChange) {
        this.handleZoomMinus()
      }

  }

  handleZoomPlus() {
    if (this.multiplicator > 1.5) return

    this.multiplicator += 0.1

    const newWidth = (this.multiplicator * parseInt(this.baseWidth, 10)).toFixed(1);
    this.width.set(`${newWidth}mm`);

    const newHeight = (this.multiplicator * parseInt(this.baseHeight, 10)).toFixed(1);
    this.height.set(`${newHeight}mm`);

    const newPx = (this.multiplicator * parseInt(this.basePx, 10)).toFixed(1);
    this.px.set(`${newPx}px`);

    const newPy = (this.multiplicator * parseInt(this.basePy, 10)).toFixed(1);
    this.py.set(`${newPy}px`);

    const newFontSize = (this.multiplicator * parseInt(this.baseFontSize, 10)).toFixed(1);
    this.fontSize.set(`${newFontSize}px`);

    const newLineHeight = (this.multiplicator * parseInt(this.baseLineHeight, 10)).toFixed(1);
    this.lineHeight.set(`${newLineHeight}px`);

  }
  
  handleZoomMinus() {
    if (this.multiplicator < 0.4) return
  
    this.multiplicator -= 0.1
  
    const newWidth = (this.multiplicator * parseInt(this.baseWidth, 10)).toFixed(1);
    this.width.set(`${newWidth}mm`);
  
    const newHeight = (this.multiplicator * parseInt(this.baseHeight, 10)).toFixed(1);
    this.height.set(`${newHeight}mm`);
  
    const newPx = (this.multiplicator * parseInt(this.basePx, 10)).toFixed(1);
    this.px.set(`${newPx}px`);
  
    const newPy = (this.multiplicator * parseInt(this.basePy, 10)).toFixed(1);
    this.py.set(`${newPy}px`);
  
    const newFontSize = (this.multiplicator * parseInt(this.baseFontSize, 10)).toFixed(1);
    this.fontSize.set(`${newFontSize}px`);
  
    const newLineHeight = (this.multiplicator * parseInt(this.baseLineHeight, 10)).toFixed(1);
    this.lineHeight.set(`${newLineHeight}px`);
  }
  

  ngOnInit(): void {
    this.editor.nativeElement.addEventListener('input', this.checkOverflow.bind(this));
    const bookSelected = this.bookService.bookSelected();

    if (!bookSelected) {
      console.error('No book selected');
      return;
    }

    if (bookSelected.format === 'big') {
      this.width.set('210mm');
      this.height.set('297mm');
      this.baseWidth = '210mm';
      this.baseHeight = '297mm';
    } else if (bookSelected.format === 'medium') {
      this.width.set('148mm');
      this.height.set('210mm');
      this.baseWidth = '148mm';
      this.baseHeight = '210mm';
    } else if (bookSelected.format === 'small') {
      this.width.set('105mm');
      this.height.set('148mm');
      this.baseWidth = '105mm';
      this.baseHeight = '148mm';
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
  }

  ngAfterViewInit() {
    const editor = document.getElementById("editor");
    const bookSelected = this.bookService.bookSelected();
  
    if (!editor) {
      console.error('Editor element not found');
      return;
    }
  
    if (!bookSelected) {
      console.error('No book selected');
      return;
    }
  
    const pages = bookSelected.pages;
    if (!pages) {
      console.error('No pages found in the selected book');
      return;
    }
  
    const pagesLength = pages.length;
    if (pagesLength > 0) {
      editor.innerHTML = pages[0].content || '';
    } else {
      const newPage = { index: pagesLength, content: '', bookId: bookSelected.id };
  
      if (newPage.bookId !== undefined) {
        this.bookService.selectPage(newPage);
      } else {
        console.error('New page has undefined bookId');
      }
    }
     
  }
  

  constructor (public bookService: BookService) {}
}

