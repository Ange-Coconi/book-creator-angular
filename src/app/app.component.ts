import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainLayoutComponent],
  template: `
    <main class="border-r border-5 border-solid">
      <app-main-layout/>
      <router-outlet class="border-r border-5 border-solid"/>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'book-creator-angular';
}
