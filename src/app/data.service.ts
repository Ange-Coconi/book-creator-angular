import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Page } from './models/page.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) { }

  getBooksDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/dashboard`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching books dashboard', error); 
        throw error; 
      })
    );
  }

  getBibliothek(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bibliothek`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching bibliothek', error); 
        throw error; 
      })
    );
  }

  getBook(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching book', error); 
        throw error; 
      })
    );
  }

  getFolder(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/folders/${id}`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error fetching folder', error); 
        throw error; 
      })
    );
  };

  createFolder(name: string, parentFolderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/folders`, {
      body: {
        name: name,
        parentFolderId: parentFolderId
      }
    }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error creating a folder: ', error); 
        throw error; 
      })
    );
  };

  createBook(title: string, format: string, padding: string, folderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/books`, {
      body: {
        title,
        folderId
      }
    }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error creating a book: ', error); 
        throw error; 
      })
    );
  };

  deleteFolder(folderId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/folders/${folderId}`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error deletin a folder', error); 
        throw error; 
      })
    );
  };

  deleteBook(bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/folders/${bookId}`).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error deleting a book: ', error); 
        throw error; 
      })
    );
  };

  updateBook(bookId: number, pages: Page[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/books/${bookId}`, {
      body: {
        pages
      }
    }).pipe(
      map(response => response),
      catchError(error => { 
        console.error('Error updating book', error); 
        throw error; 
      })
    );
  };
 
}
