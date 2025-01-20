import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; 

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      body: {
        username,
        password,
      }
    }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error login : ', error); 
        throw error; 
      })
    );
  }

  signIn(username: string, password: string, email?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signin`, {
      body: {
        username,
        password,
        email
      }
    }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error sign-in : ', error); 
        throw error; 
      })
    );
  }
}
