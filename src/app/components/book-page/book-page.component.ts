import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { PageRectoVerso } from '../../models/page-recto-verso.model';

@Component({
  selector: 'app-book-page',
  imports: [],
  template: `
      <div [id]="'page-' + data.index.toString() + '-content'" >
      </div>
  `,
  styles: ``
})
export class BookPageComponent implements AfterViewInit {
  @Input()
  data!: PageRectoVerso;

  ngAfterViewInit(): void {
    const pageHTML = document.getElementById(`page-${this.data.index}-content`)
    console.log(`page-${this.data.index}-content`)
    console.log(pageHTML)
    if (pageHTML === null) return
    pageHTML.innerHTML = this.data.recto._content;
    console.log(pageHTML)
  }

}
