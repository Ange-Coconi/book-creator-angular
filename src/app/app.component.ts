import { Component, OnInit } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { Router, RouterOutlet } from '@angular/router';
import { BookService } from './book.service';
import { ViewService } from './view.service';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  imports: [ MainLayoutComponent, RouterOutlet],
  template: `
    <main [class]="backgroundClass">
      @if (authService.alert() !== '') {
        <div class="fixed top-[20%] left-[30%] w-[40%] h-[10%] flex justify-center items-center z-[50] bg-white border-red-600 border-2 rounded">
          <p class="text-black text-lg font-bold">{{authService.alert()}}</p>
        </div>
      }
      <app-main-layout class="fixed top-0 left-0 w-full h-14"/>
      <router-outlet ></router-outlet>
    </main>
  `,
  styles: `

  .dashboard-background {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: url('src/app/assets/bg-dashboard.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    background-size: cover;
  }

  .form-background {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: url('src/app/assets/bg-dashboard.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    background-size: cover;
  }

  .visualize-background {
    top: 0;
    left: 0;
    width: calc(100vw - 17px);
    height: 100vh;
    min-height: 100vh;
    background: url('src/app/assets/bg-dashboard.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed;
    background-size: cover;
  }

  .default-background {
    top: 0;
    left: 0;
    width: calc(100vw - 17px);
    height: 100vh;
    min-height: 100vh;
  }
  `,
})
export class AppComponent implements OnInit {
  title = 'book-creator-angular';
  backgroundClass: string = '';

  constructor(
    public bookService: BookService, 
    public viewService: ViewService, 
    private router: Router,
    public authService: AuthService
  ) {
      this.router.events.subscribe(() => {
        // Set the background class based on the current route
        this.backgroundClass = this.getBackgroundClass(this.router.url);
      });
  }

  getBackgroundClass(route: string): string {
    switch (route) {
      case '/':
        return 'dashboard-background';
      case '/creation-book':
        return 'visualize-background';
      case '/contact':
        return 'form-background';
      case '/login':
        return 'form-background';
      case '/sign-in':
        return 'form-background';
      case '/account':
        return 'form-background';
      default:
        return 'default-background';
    }
  }

  ngOnInit() {
     
    }

   
}
