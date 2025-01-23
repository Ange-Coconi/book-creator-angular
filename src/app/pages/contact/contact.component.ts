
import { CommonModule } from '@angular/common';
import { BookService } from '../../book.service';
import { DataService } from '../../data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="w-full h-full flex justify-center items-center" >
      @if (redirection) {
        <div class="w-[20%] h-[20%] flex flex-col mb-20 justify-center items-center bg-slate-900/75 text-white rounded-xl">
          <h2 class="mb-2"> Contact : </h2>
          <a class="underline underline-offset-2 hover:opacity-80" href="https://angecoconiwebsite.com" target="_blank" rel="noreferrer">ange coconi website</a>
        </div>
        <div class="fixed bottom-[0px] left-0 w-full h-[2rem] flex justify-center items-center bg-slate-900/75 text-white rounded-xl">
          <a href="https://www.freepik.com/free-vector/red-text-book-closed-icon_70015834.htm" target="_blank" rel="noreferrer">Image by jemastock on Freepik</a>
        </div>
      } @else {
        <form class="w-[50%] h-[85%] flex flex-col mb-4 justify-center items-center bg-slate-900/75 text-white rounded-xl" [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <div class="w-[40%] flex flex-col mb-2">
              <label class="mb-1" for="firstname">First Name</label>
              <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="firstname" formControlName="firstname" type="text" required>
              <div *ngIf="contactForm.get('firstname')?.invalid && (contactForm.get('firstname')?.dirty || contactForm.get('firstname')?.touched)">
                  <small *ngIf="contactForm.get('firstname')?.errors?.['required']">First Name is required.</small>
              </div>
            </div>

            <div class="w-[40%] flex flex-col mb-2">
              <label class="mb-1" for="lastname">Last Name</label>
              <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="lastname" formControlName="lastname" type="text" required>
              <div *ngIf="contactForm.get('lastname')?.invalid && (contactForm.get('lastname')?.dirty || contactForm.get('lastname')?.touched)">
                  <small *ngIf="contactForm.get('lastname')?.errors?.['required']">Last Name is required.</small>
              </div>
            </div>
            
            <div class="w-[40%] flex flex-col mb-6">
              <label class="mb-1" for="email">Email</label>
              <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="email" formControlName="email" type="email">
              <div *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.dirty || contactForm.get('email')?.touched)">
                  <small *ngIf="contactForm.get('email')?.errors?.['email']">Please enter a valid email address.</small>
              </div>
            </div>

            <div class="w-[40%] flex flex-col mb-0">
              <label class="mb-1" for="reason">Reason</label>
              <input class="text-black px-2 rounded-lg h-[2rem] w-full" id="reason" formControlName="reason" type="reason" required>
              <div *ngIf="contactForm.get('reason')?.invalid && (contactForm.get('reason')?.dirty || contactForm.get('reason')?.touched)">
                  <small *ngIf="contactForm.get('reason')?.errors?.['required']">Reason is required.</small>
              </div>
            </div> 

            <div class="w-[90%] flex flex-col mb-4">
              <label class="mb-1" for="message">Message</label>
              <textarea class="text-black px-2 py-1 rounded-lg h-[8rem] w-full" id="message" formControlName="message" type="message" required></textarea>
              <div *ngIf="contactForm.get('message')?.invalid && (contactForm.get('message')?.dirty || contactForm.get('message')?.touched)">
                  <small *ngIf="contactForm.get('message')?.errors?.['required']">Message is required.</small>
              </div>
            </div>

            <button class="text-white text-lg border-white py-1 px-2 border-2 rounded shadow-md hover:opacity-80" type="submit" [disabled]="contactForm.invalid">Send</button>
        </form>
      }
    </div>
  `,
  styles:`
  `,
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  contactTimeout: any;
  redirection: boolean = true;
  errorTimeout: any;

  constructor(
    private fb: FormBuilder, 
    public bookService: BookService, 
    public dataservice: DataService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("hello")
    this.contactForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      reason: ['', Validators.required],
      message: ['', Validators.required],
    });
    console.log(this.contactForm)
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);

      const firstname = this.contactForm.get('firstname')?.value; 
      const lastname = this.contactForm.get('lastname')?.value; 
      const email = this.contactForm.get('email')?.value;
      const reason = this.contactForm.get('reason')?.value; 
      const message = this.contactForm.get('message')?.value; 

      this.authService.contact(firstname, lastname, email, reason, message).subscribe({
        next: (data) => {

          console.log(data)
        },
        error: (error) => {
          console.error('Error contact : ', error);
          if (error.error.message && typeof error.error.message === 'string') {
            this.authService.alert.set(error.error.message);
  
            if (this.contactTimeout) {
              clearTimeout(this.contactTimeout)
            }
  
            this.contactTimeout = setTimeout(() => {
              this.authService.alert.set('')
            }, 2500)
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.authService.logOut().subscribe({
      next: (data) => {
        this.authService.userData.set(null);

      },
      error: (error) => {
        console.error('Error sign-in : ', error);
        if (error.error.message && typeof error.error.message === 'string') {
          this.authService.alert.set(error.error.message);

          if (this.errorTimeout) {
            clearTimeout(this.errorTimeout)
          }

          this.errorTimeout = setTimeout(() => {
            this.authService.alert.set('')
          }, 2500)
        }
      }
    })
  }
}

