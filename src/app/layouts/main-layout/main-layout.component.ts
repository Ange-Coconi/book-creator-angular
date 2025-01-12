import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, RouterOutlet],
  template: `
    <header class="fixed top-0 left-0 w-full h-12">
      <nav class="flex justify-evenly align-center px-4 py-4 bg-slate-900 text-white">
          <a class="text-white text-2xl no-underline" [routerLink]="dashboardPath" routerLinkActive="router-link-active">Dashboard</a>
          <a class="text-white text-2xl no-underline" [routerLink]="bookFeaturePath" routerLinkActive="router-link-active">Visualize your Book</a>
          <a class="text-white text-2xl no-underline" [routerLink]="contactPath" routerLinkActive="router-link-active">Contact</a>
      </nav>
  </header>
  <router-outlet />
  `,
  styles: `
  .containerHeader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3rem;
  }

  .navbar {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      background-color: rgb(0, 0, 0, 0.95);
      /* backdrop-filter: sepia(90%); */
      padding: 1rem;
  }

  .navlink {

      color: white;
      font-size: 1.5rem;
      text-decoration: none;
  }
  `
})
export class MainLayoutComponent {
  dashboardPath: string = "/";
  contactPath: string = "/contact";
  bookFeaturePath: string = "/creation-book"
}
