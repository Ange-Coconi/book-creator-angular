import { Component, InjectionToken, Inject } from '@angular/core';

export const TITLE_TOKEN = new InjectionToken<string>('title');

@Component({
  selector: 'app-book',
  imports: [],
  template: `
    <p>
      book works!
    </p>
  `,
  styles: ``
})
export class BookComponent {
  title: string;

  constructor(@Inject(TITLE_TOKEN) title: string) {
    this.title = title;
  }
}
