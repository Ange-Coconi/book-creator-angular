import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { BookService } from '../../book.service';
import { DataService } from '../../data.service';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterLink, CommonModule],
  template: `
    <header class="w-full h-full z-30 flex justify-between items-center bg-slate-900/75 text-white ">
      <nav class="w-[80%] h-full flex justify-evenly items-center px-2 py-2">
          <a class="text-white text-2xl no-underline shadow-sm hover:opacity-80" [routerLink]="dashboardPath" routerLinkActive="router-link-active">Dashboard</a>
          <a class="text-white text-2xl no-underline shadow-sm hover:opacity-80" [routerLink]="bookFeaturePath" routerLinkActive="router-link-active">Visualize your Book</a>
          <a class="text-white text-2xl no-underline shadow-sm hover:opacity-80" [routerLink]="contactPath" routerLinkActive="router-link-active">Contact</a>
      </nav>
      @if (authService.userData() === null){
        <nav class="w-[20%] h-full flex justify-evenly items-center px-2 py-2 ">
          <a class="text-white text-lg no-underline border-white py-1 px-2 border-2 rounded shadow-sm hover:opacity-80" [routerLink]="logIn" routerLinkActive="router-link-active">Log In</a>
          <a class="text-white text-lg no-underline border-white py-1 px-2 border-2 rounded shadow-sm hover:opacity-80" [routerLink]="signIn" routerLinkActive="router-link-active">Sign In</a>
        </nav>
      } @else {
        <nav class="w-[20%] h-full flex justify-evenly items-center px-2 py-2 ">
          <a class="text-white text-lg no-underline border-white py-1 px-2 border-2 rounded shadow-sm hover:opacity-80" [routerLink]="account" routerLinkActive="router-link-active">{{authService.userData()?.username}}</a>
        </nav>
      }
      
  </header>
  
  `
})
export class MainLayoutComponent {

  dashboardPath: string = "/";
  contactPath: string = "/contact";
  bookFeaturePath: string = "/creation-book";
  logIn: string = "/login";
  signIn: string = "/sign-in";
  account: string = `/account`

  constructor(
        public bookService: BookService, 
        public dataservice: DataService,
        public authService: AuthService,
      ) {}

}
