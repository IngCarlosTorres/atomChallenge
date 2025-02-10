import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpclientService } from '../../services/httpclient/httpclient.service';
import { respApi } from '../../models/respApi.model'
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatIconModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  emailInvalid: boolean = false;
  private emailValidated = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private inputTextValidated = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$";

  constructor(private httpclientService: HttpclientService, private localStorageService: LocalStorageService, private router: Router) { }

  validateEmail(): boolean {
    this.emailInvalid = !this.emailValidated.test(this.email);
    return !this.emailInvalid;
  }

  onSubmit(): void {
    if (this.validateEmail()) {
      this.httpclientService.get<respApi>('users/' + this.email).subscribe({
        next: (data) => {
          if (data.respApi.status === 404) {
            Swal.fire({
              title: "¡Error!",
              text: "El usuario ingresado no existe, ¿Desea registrarse?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#FF5B00",
              cancelButtonColor: "#d33",
              confirmButtonText: "Registrarse",
            }).then((result) => {
              if (result.isConfirmed) {
                this.registerModal(this.email);
              } else {
                this.email = "";
              }
            });
          } else {
            Swal.fire('¡Bienvenido!', this.email, 'success');
            this.localStorageService.setItem('isLogin', true);
            this.localStorageService.setItem('userLogin', this.email);
            this.localStorageService.setItem('userLisSelect','All');
            this.email = "";
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          Swal.fire('¡Error!', 'Ha ocurrido un error, por favor intente más tarde', 'error');
        }
      });
    }
  }

  registerModal(emailSave: string): void {
    Swal.fire({
      title: 'Registrarse',
      html: `
        <input id="emailregister" class="swal2-input" placeholder="Correo electrónico" value="${emailSave}">
        <input id="name" class="swal2-input" placeholder="Nombre">
        <input id="lastname" class="swal2-input" placeholder="Apellio">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrarse',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'responsive-swal',
      },
      preConfirm: () => {
        const email = (document.getElementById('emailregister') as HTMLInputElement).value;
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const lastname = (document.getElementById('lastname') as HTMLInputElement).value;


        if (!email || !name || !lastname) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return;
        } else {
          if (!email.match(this.emailValidated)) {
            Swal.showValidationMessage('Por favor, introduce un correo electrónico válido');
            return;
          } else {
            if (!name.match(this.inputTextValidated) || !lastname.match(this.inputTextValidated)) {
              Swal.showValidationMessage('Por favor, introduce un Nombre y Apellido válidos sin caracteres especiales ni números');
              return;
            } else {
              return { email, name, lastname };
            }
          }
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpclientService.post<respApi>('users', result.value).subscribe({
          next: (data) => {
            if (data.respApi.status === 201) {
              Swal.fire('¡Exito!', 'Usuario registrado correctamente', 'success');
              this.localStorageService.setItem('userLisSelect','All');
              this.localStorageService.setItem('isLogin', true);
              this.localStorageService.setItem('userLogin', result.value.email);
              this.email = "";
              this.router.navigate(['/home']);
            } else {
              Swal.fire('¡Error!', 'Ha ocurrido un error, por favor intente más tarde', 'error');
            }
          },
          error: (err) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error, por favor intente más tarde', 'error');
          }
        });

      }
    });
  }
}
