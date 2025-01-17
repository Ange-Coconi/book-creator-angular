import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ MainLayoutComponent, RouterOutlet],
  template: `
    <main class="main">
      <app-main-layout class="fixed top-0 left-0 w-full h-14"/>
      <router-outlet ></router-outlet>
    </main>
  `,
  styles: `
  .main {
    top: 0;
    left: 0;
    width: calc(100vw - 17px);
    height: 100vh;
    min-height: 100vh;
  }
  `,
})
export class AppComponent {
  title = 'book-creator-angular';
}
