import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="w-full h-full flex justify-center items-center" >
    <form class="w-[40%] h-[70%] flex flex-col justify-center items-center bg-slate-900/75 text-white rounded-xl" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="w-[60%] flex flex-col mb-6">
          <label class="mb-1" for="username">Username</label>
          <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="username" formControlName="username" type="text" required>
          <div *ngIf="loginForm.get('username')?.invalid && (loginForm.get('username')?.dirty || loginForm.get('username')?.touched)">
              <small *ngIf="loginForm.get('username')?.errors?.['required']">Username is required.</small>
          </div>
        </div>
        
        <div class="w-[60%] flex flex-col mb-6">
          <label class="mb-1" for="password">Password</label>
          <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="password" formControlName="password" type="password" required>
          <div *ngIf="loginForm.get('password')?.invalid && (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)">
              <small *ngIf="loginForm.get('password')?.errors?.['required']">Password is required.</small>
          </div>
        </div>
        <button class="text-white text-lg border-white py-1 px-2 border-2 rounded shadow-md hover:opacity-80" type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
    </div>
  `,
  styles:`
  `,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
      private fb: FormBuilder, 
      public bookService: BookService, 
      public dataservice: DataService,
      public authService: AuthService,
      private router: Router
    ) {}

  ngOnInit(): void {
    console.log("haha")
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form Submitted', this.loginForm.value);

      const username = this.loginForm.get('username')?.value; 
      const password = this.loginForm.get('password')?.value; 

      this.authService.login(username, password).subscribe({
            next: (data) => {

              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error fetching books dashboard: ', error);
            }
          });
    }
  }
}
