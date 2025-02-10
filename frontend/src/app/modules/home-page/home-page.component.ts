import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatIconModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
