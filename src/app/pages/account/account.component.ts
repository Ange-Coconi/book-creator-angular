import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  template: `
    <div class="w-full h-full flex justify-center items-center">
      <div class="w-[45%] h-[50%] flex flex-col justify-center items-center bg-slate-900/75 text-white rounded-xl">
        <div class="w-[80%] flex flex-col mb-8">
          <p>Username : {{ authService.userData()?.username }}</p>
        </div>
        <div class="w-[80%] flex flex-col mb-10">
          <p >Email : {{authService.userData()?.email}}</p>
        </div>
        <button class="text-white text-lg border-white py-1 px-2 border-2 rounded shadow-md hover:opacity-80" type="submit" (click)="handleLogOut()">Log out</button>
      </div>
    </div>
  `,
})
export class AccountComponent implements OnInit {

  errorTimeout: any;

  constructor(public authService: AuthService, private router: Router) {}

  handleLogOut() {

    this.authService.logOut().subscribe({
      next: (data) => {
        this.authService.userData.set(null);

        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error sign-in : ', error);
      }
    })
  }

  ngOnInit(): void {
    if (this.authService.userData() === null) {
      this.router.navigate(['/login']);
    }
  }

  
}
