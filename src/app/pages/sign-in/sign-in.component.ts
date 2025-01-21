
import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="w-full h-full flex justify-center items-center" >
    <form class="w-[40%] h-[70%] flex flex-col justify-center items-center bg-slate-900/75 text-white rounded-xl" [formGroup]="signInForm" (ngSubmit)="onSubmit()">
        <div class="w-[60%] flex flex-col mb-6">
          <label class="mb-1" for="username">Username</label>
          <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="username" formControlName="username" type="text" required>
          <div *ngIf="signInForm.get('username')?.invalid && (signInForm.get('username')?.dirty || signInForm.get('username')?.touched)">
              <small *ngIf="signInForm.get('username')?.errors?.['required']">Username is required.</small>
          </div>
        </div>
        
        <div class="w-[60%] flex flex-col mb-6">
          <label class="mb-1" for="password">Password</label>
          <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="password" formControlName="password" type="password" required>
          <div *ngIf="signInForm.get('password')?.invalid && (signInForm.get('password')?.dirty || signInForm.get('password')?.touched)">
              <small *ngIf="signInForm.get('password')?.errors?.['required']">Password is required.</small>
          </div>
        </div>
        
        <div class="w-[60%] flex flex-col mb-6">
          <label class="mb-1" for="email">Email (optional)</label>
          <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="email" formControlName="email" type="email">
          <div *ngIf="signInForm.get('email')?.invalid && (signInForm.get('email')?.dirty || signInForm.get('email')?.touched)">
              <small *ngIf="signInForm.get('email')?.errors?.['email']">Please enter a valid email address.</small>
          </div>
        </div>

        <button class="text-white text-lg border-white py-1 px-2 border-2 rounded shadow-md hover:opacity-80" type="submit" [disabled]="signInForm.invalid">Sign In</button>
    </form>
    </div>
  `,
  styles:`
  `,
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    public bookService: BookService, 
    public dataservice: DataService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("hello")
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.email]
    });
    console.log(this.signInForm)
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      console.log('Form Submitted', this.signInForm.value);

      const username = this.signInForm.get('username')?.value; 
      const password = this.signInForm.get('password')?.value; 
      const email = this.signInForm.get('email')?.value;

      this.authService.signIn(username, password, email).subscribe({
        next: (data) => {

          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error sign-in : ', error);
        }
      });
    }



  }
}

