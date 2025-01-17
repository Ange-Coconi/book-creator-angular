import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink],
  template: `
    <header class="w-full h-full z-30 flex justify-center items-center bg-slate-900/75 text-white ">
      <nav class="w-full h-full flex justify-evenly items-center px-2 py-2 ">
          <a class="text-white text-2xl no-underline" [routerLink]="dashboardPath" routerLinkActive="router-link-active">Dashboard</a>
          <a class="text-white text-2xl no-underline" [routerLink]="bookFeaturePath" routerLinkActive="router-link-active">Visualize your Book</a>
          <a class="text-white text-2xl no-underline" [routerLink]="contactPath" routerLinkActive="router-link-active">Contact</a>
      </nav>
  </header>
  
  `
})
export class MainLayoutComponent {
  dashboardPath: string = "/";
  contactPath: string = "/contact";
  bookFeaturePath: string = "/creation-book"
}
