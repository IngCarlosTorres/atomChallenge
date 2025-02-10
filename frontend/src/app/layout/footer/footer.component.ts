import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Menu } from '../../models/options.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  menuData: Menu | null = null;
  constructor(private localStorageService: LocalStorageService) { }
  ngOnInit() {
    this.menuData = this.localStorageService.getItem<Menu>('menuOptions'); 
  }
}
