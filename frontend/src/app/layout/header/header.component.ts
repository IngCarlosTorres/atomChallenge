import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Menu } from '../../models/options.model';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ CommonModule, MatIconModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuData: Menu | null = null;

  constructor(private localStorageService: LocalStorageService, private router: Router) { }

  ngOnInit() {
    this.menuData = this.localStorageService.getItem<Menu>('menuOptions'); 
  }

  isLogin = this.localStorageService.getItem<boolean>('isLogin');
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.localStorageService.setItem("isLogin",false);
    this.localStorageService.setItem("userLisSelect",'All');
    this.router.navigate(['/login']);
  }
}
