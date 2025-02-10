import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { respApi } from '../../models/respApi.model';
import { HttpclientService } from '../../services/httpclient/httpclient.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newtask',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatIconModule, CommonModule, FormsModule],
  templateUrl: './newtask.component.html',
  styleUrl: './newtask.component.css'
})
export class NewtaskComponent {

  titleTask: string = "";
  descriptionTask: string = "";
  logginActivate: any = null;

  constructor(private httpclientService: HttpclientService, private localStorageService: LocalStorageService, private router: Router) { 
    this.logginActivate = this.localStorageService.getItem('isLogin');
  }

  ngOnInit(): void {
    if (this.logginActivate === false || this.logginActivate === null ) {
      Swal.fire('¡Error!', 'Acceso no autorizado', 'error');
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.titleTask !== "" && this.descriptionTask !== "") {
      this.httpclientService.post<respApi>('tasks/', { title: this.titleTask, description: this.descriptionTask }).subscribe({
        next: (data) => {
          if (data.respApi.status === 302) {
            Swal.fire('¡Error!', data.respApi.message, 'error');
          } else {
            Swal.fire('¡Exito!', data.respApi.message, 'success');
            this.localStorageService.setItem('isLogin', true);
            this.titleTask = "";
            this.descriptionTask = "";
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          Swal.fire('¡Error!', 'Ha ocurrido un error, por favor intente más tarde', 'error');
        }
      });
    } else {
      Swal.fire('¡Error!', 'Debe ingresar información en todos los campos', 'error');
    }
  }

}
