import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://book-app-backend-a3d346b4aef7.herokuapp.com/auth'; 
  userData = signal<User | null>(null);
  alert = signal<string>('');

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
        username,
        password,
      }, {
        withCredentials: true, // Include credentials
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error login : ', error); 
        throw error; 
      })
    );
  }

  signIn(username: string, password: string, email?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, {
        username,
        password,
        email
      }, {
        withCredentials: true, // Include credentials
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error sign-in : ', error); 
        throw error; 
      })
    );
  };

  logOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      withCredentials: true, // Include credentials
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error log-out : ', error); 
        throw error; 
      })
    );
  };

  contact(firstname: string, lastname: string, email: string, reason: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, {
        firstname,
        lastname,
        email,
        reason,
        message
      }, {
        withCredentials: true, // Include credentials
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error sign-in : ', error); 
        throw error; 
      })
    );
  };

}
