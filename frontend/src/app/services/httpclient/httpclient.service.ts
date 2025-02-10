import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpclientService {
  constructor(private http: HttpClient) { }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${environment.URL_API}${url}`);
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${environment.URL_API}${url}`, body);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${environment.URL_API}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${environment.URL_API}${url}`);
  }

}
