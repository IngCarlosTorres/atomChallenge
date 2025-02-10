import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService } from '../app/services/local-storage/local-storage.service';
import { MenuService } from '../app/services/header-menu/menu.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';

  constructor(private localStorageService: LocalStorageService, private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.getMenu().subscribe({
      next: (data) => {
        this.localStorageService.setItem('menuOptions', data);
      },
      error: (error) => console.error('Error al cargar los menus principales:', error)
    });
  }
}
