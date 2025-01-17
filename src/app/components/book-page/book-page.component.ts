import { Component, Input, OnInit } from '@angular/core';
import { Page } from '../../models/page.model';
import { PageSwallow } from '../../models/page-swallow.model';

@Component({
  selector: 'app-book-page',
  imports: [],
  template: `
    <div [id]="data._index" >

    </div>
  `,
  styles: ``
})
export class BookPageComponent implements OnInit {
  @Input()
  data!: PageSwallow;

  ngOnInit(): void {
    const pageHTML = document.getElementById(`${this.data._index}`)
    if (pageHTML === null) return
    pageHTML.innerHTML = this.data._content;
    pageHTML.style.transform = ''
  }

}
