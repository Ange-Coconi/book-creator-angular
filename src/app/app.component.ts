import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ MainLayoutComponent, RouterOutlet],
  template: `
    <main class="top-0 left-0 w-full h-full">
      <app-main-layout class="fixed top-0 left-0 w-full h-14"/>
      <router-outlet ></router-outlet>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'book-creator-angular';
}
