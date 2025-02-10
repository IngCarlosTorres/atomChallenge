import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  convertDate(timestamp: any): string {
    if (!timestamp) return '';

    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}
