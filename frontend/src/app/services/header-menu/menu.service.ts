import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../../models/options.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private jsonUrl = 'assets/json/dataHeaderFooter.json'; // Ruta al archivo JSON

  constructor(private http: HttpClient) {}

  getMenu(): Observable<Menu> {
    return this.http.get<Menu>(this.jsonUrl);
  }
}
