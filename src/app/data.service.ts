import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://book-app-backend-a3d346b4aef7.herokuapp.com/api'; 

  constructor(private http: HttpClient) { }

  getBooksDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/dashboard`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching books dashboard', error); 
        throw error; 
      })
    );
  }

  getBibliothek(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bibliothek`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching bibliothek', error); 
        throw error; 
      })
    );
  }

  getBook(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching book', error); 
        throw error; 
      })
    );
  }

  getFolder(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/folders/${id}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching folder', error); 
        throw error; 
      })
    );
  };

  createFolder(name: string, parentFolderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/folders`, {
        name: name,
        parentFolderId: parentFolderId
    }, {
        withCredentials: true, // Include credentials
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error creating a folder: ', error); 
        throw error; 
      })
    );
  };

  createBook(title: string, format: string, padding: string, folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, {
      title,
      folderId, 
      format,
      padding
    }, {
      withCredentials: true, // Include credentials
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error creating a book: ', error); 
        throw error; 
      })
    );
  };

  createBookUploaded(dataUpload: string[], format: string, padding: string, folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/books/upload`, {
      dataUpload,
      folderId, 
      format,
      padding
    }, {
      withCredentials: true, // Include credentials
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error creating a book: ', error); 
        throw error; 
      })
    );
  };

  deleteFolder(folderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/folders/${folderId}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error deletin a folder', error); 
        throw error; 
      })
    );
  };

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/books/${bookId}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error deleting a book: ', error); 
        throw error; 
      })
    );
  };

  updateBook(bookId: number, pages: Page[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${bookId}`, {
        pages: pages
    }, {
      withCredentials: true, // Include credentials
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })}).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error updating book', error); 
        throw error; 
      })
    );
  };
 
}
