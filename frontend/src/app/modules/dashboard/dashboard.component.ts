import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { HttpclientService } from '../../services/httpclient/httpclient.service';
import { respApi } from '../../models/respApi.model';
import { User } from '../../models/user.model'
import { Task } from '../../models/task.model';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { GeneralService } from '../../services/general/general.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MatIconModule, MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  pendingTasks: Task[] = [];
  completedTasks: Task[] = [];
  userList: User[] = [];
  selectedFilter: any = 'All';
  userLoggin: any = null;
  logginActivate: any = null
  idListOrder: number = 4;

  userListFilter = [{ id: 1, value: "All", label: "Todas las tareas" }]

  constructor(private httpclientService: HttpclientService, private localStorageService: LocalStorageService, private router: Router, private route: ActivatedRoute, private generalService: GeneralService) { 
    this.logginActivate = this.localStorageService.getItem('isLogin');
  }

  ngOnInit(): void {
    
    if (this.logginActivate === true && this.logginActivate !== null) {
      this.pendingTasks = [];
      this.completedTasks = [];
      this.userLoggin = this.localStorageService.getItem('userLogin');
      this.getUsers();
      this.getTasks();
      
    } else {
      Swal.fire('¡Error!', 'Acceso no autorizado', 'error');
      this.router.navigate(['/home']);
    }
  }

  getUsers(): void {
    this.userList = [];
    this.idListOrder = 4;
    this.httpclientService.get<respApi>('users').subscribe({
      next: (data) => {
        if (data.respApi.status === 404) {
          Swal.fire({
            title: "¡Advertencia!",
            text: "Actualmente no hay usuarios disponibles para asignar",
            icon: "warning",
            confirmButtonColor: "#FF5B00",
            confirmButtonText: "OK",
          }).then((result) => {
            return;
          });
        } else {
          this.userList.push({ assignedTo: "", nameComplete: "SIN ASIGNAR" });
          this.userListFilter.push({ id: 2, value: "", label: "SIN ASIGNAR" });
          if (data.respApi.userList) {
            this.userList = this.userList.concat(...data.respApi.userList);
            const userListFilterTemp = this.userList
              .filter(doc => doc.assignedTo !== '')
              .map(doc => ({
                id: this.userLoggin === doc.assignedTo.split('-')[0] ? 3 : this.idListOrder+1,
                value: doc.assignedTo,
                label: this.userLoggin === doc.assignedTo.split('-')[0] ? 'Me' : doc.nameComplete
              }));
            this.userListFilter = this.userListFilter.concat(...userListFilterTemp);
            this.userListFilter.sort((a,b) => a.id - b.id);
          }
        }
      },
      error: (err) => {
        Swal.fire('¡Error!', 'Ha ocurrido un error al obtener lista de tareas, por favor intente más tarde', 'error');
      }
    });
  }

  getTasks(): void {
    this.pendingTasks = [];
    this.completedTasks = [];
    this.httpclientService.get<respApi>('tasks').subscribe({
      next: (data) => {
        if (data.respApi.status === 404) {
          Swal.fire({
            title: "¡Advertencia!",
            text: "Actualmente no hay tareas registradas, ¿Desea registrar una?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#FF5B00",
            cancelButtonColor: "#d33",
            confirmButtonText: "Registrar tarea",
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/newtask']);
            } else {
              this.router.navigate(['/home']);
            }
          });
        } else {
          if (data.respApi.taskList) {
            data.respApi.taskList = this.orderByListDate(data.respApi.taskList);
            if (data.respApi.taskList) {
              data.respApi.taskList.forEach(task => {
                if (task.assigned === null) {
                  task.assigned = "SIN ASIGNAR";
                }
                if (!task.status) {
                  this.pendingTasks.push(task);
                } else {
                  this.completedTasks.push(task)
                }
              });
            }
          }
        }
      },
      error: (err) => {
        Swal.fire('¡Error!', 'Ha ocurrido un error al obtener lista de tareas, por favor intente más tarde', 'error');
      }
    });
  }

  orderByListDate(list: any[]): any {
    list.sort((a,b)=> {
      if (a.dateCreated._seconds !== b.dateCreated._seconds) { return b.dateCreated._seconds - a.dateCreated._seconds }
      return b.dateCreated._nanoseconds - a.dateCreated._nanoseconds;
    })
    return list;
  }

  getTasksForUser(assignedTo: any): void {
    if (assignedTo === '') assignedTo = null;

    this.httpclientService.get<respApi>('tasks/' + assignedTo).subscribe({
      next: (data) => {
        this.pendingTasks = [];
        this.completedTasks = [];
        if (data.respApi.status === 404) {
          Swal.fire('¡Advertencia!', 'No existen tareas para el filtro seleccionado', 'warning');
        } else {

          if (data.respApi.taskList) {
            data.respApi.taskList = this.orderByListDate(data.respApi.taskList);
            if (data.respApi.taskList) {
              data.respApi.taskList.forEach(task => {
                if (task.assigned === null) {
                  task.assigned = "SIN ASIGNAR";
                }
  
                if (!task.status) {
                  this.pendingTasks.push(task);
                } else {
                  this.completedTasks.push(task)
                }
  
              });
            }
          }
        }
      },
      error: (err) => {
        Swal.fire('¡Error!', 'Ha ocurrido un error al obtener lista de tareas, por favor intente más tarde', 'error');
      }
    });
  }


  completeTask(task: Task, isCompleted: boolean) {
    if (task.assigned === 'SIN ASIGNAR') {
      Swal.fire('¡Error!', 'La tarea no se puede completar o regresar a pendientes porque no ha sido asignada, ¡ASIGNELA!', 'error');
    } else {
      task.status = isCompleted;
      this.httpclientService.put<respApi>('tasks/' + task.id, task).subscribe({
        next: (data) => {
          if (data.respApi.status === 404) {
            Swal.fire('¡Error!', 'No se pudo completar o regresar a pendientes la tarea, por favor intente más tarde', 'error');
          } else {
            this.refreshComponent();
          }
        },
        error: (err) => {
          Swal.fire('¡Error!', 'Ha ocurrido un error al completar o regresar tarea, por favor intente más tarde', 'error');
        }
      });
    }
  }


  updateTask(task: Task): void {
    Swal.fire({
      title: 'Modificar tarea',
      html: `
          <input id="title" class="swal2-input" placeholder="Titulo" value="${task.title}">
          <textarea id="description" class="swal2-textarea" placeholder="Descripción"> ${task.description.trim().replace(/\n/g, '&#10;')}</textarea>
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'responsive-swal',
      },
      preConfirm: () => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLInputElement).value;

        if (!title || !description) {
          Swal.showValidationMessage('Por favor, completa todos los campos');
          return;
        } else {
          task.title = title;
          task.description = description;
          return { task }
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(task);
        this.httpclientService.put<respApi>('tasks/' + task.id, task).subscribe({
          next: (data) => {
            if (data.respApi.status === 200) {
              Swal.fire('¡Exito!', 'La tarea se actualizo correctamente', 'success');
              this.refreshComponent();
            } else {
              Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar la tarea, por favor intente más tarde', 'error');
            }
          },
          error: (err) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al actualizar la tarea, por favor intente más tarde', 'error');
          }
        });

      }
    });
  }

  deleteTask(id: string) {
    this.httpclientService.delete<respApi>('tasks/' + id).subscribe({
      next: (data) => {
        if (data.respApi.status === 404) {
          Swal.fire('¡Error!', 'La tarea a eliminar ya fue eliminada o no existe, por favor refresque pantalla e intente más tarde', 'error');
        } else {
          Swal.fire('¡Exito!', 'La tarea fue eliminada con exito', 'success');
          this.refreshComponent();
        }
      },
      error: (err) => {
        Swal.fire('¡Error!', 'Ha ocurrido un error al eliminar tarea, por favor intente más tarde', 'error');
      }
    });
  }

  assignedTask(task: Task) {

    const selectOptions = this.userList
      .map(opt => `<option value="${opt.assignedTo}" > ${opt.nameComplete} </option>`)
      .join('');

    const assignedTo = task.assigned === "SIN ASIGNAR" ? "Asignado a: " + task.assigned : "Asignado a: " + task.assigned?.split('-')[1];
    Swal.fire({
      title: 'Asignar tarea',
      html: `
          <input id="title" class="swal2-input" placeholder="Titulo" value="${task.title}" disabled>
          <textarea id="assignedTo" class="swal2-textarea" placeholder="Asignado A" disabled> ${assignedTo.trim().replace(/\n/g, '&#10;')}</textarea>
          <select id="optionSelected" class="swal2-select">${selectOptions}</select>
        `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'responsive-swal',
      },
      preConfirm: () => {
        const userSelected = document.getElementById('optionSelected') as HTMLSelectElement;
        return userSelected.value
      }
    }).then((result) => {

      if (result.isConfirmed) {

        let valueSelected = "";
        if (result.value === "") {
          valueSelected = "SIN ASIGNAR";
        } else {
          valueSelected = result.value;
        }

        this.httpclientService.put<respApi>('tasks/assigned/' + task.id, { email: valueSelected }).subscribe({
          next: (data) => {
            if (data.respApi.status === 200) {
              Swal.fire('¡Exito!', 'La tarea se asigno correctamente', 'success');
              this.refreshComponent();
            } else {
              Swal.fire('¡Error!', 'Ha ocurrido un error al asignar la tarea, por favor intente más tarde', 'error');
            }
          },
          error: (err) => {
            Swal.fire('¡Error!', 'Ha ocurrido un error al asignar la tarea, por favor intente más tarde', 'error');
          }
        });

      }
    });
  }

  getNameAssigned(assigned: any): string {
    if (assigned === null || assigned === "" || assigned === "SIN ASIGNAR") {
      return "SIN ASIGNAR";
    } else {
      return assigned.split('-')[1];
    }

  }

  onFilterChange(event: MatSelectChange): void {
    if (event.value === 'All') {
      this.getTasks();
    } else {
      this.getTasksForUser(event.value)
    }
  }

  getTimeCompleted(timeUpdated: any, timeCreated: any): string {
    if (!timeUpdated || !timeCreated) return 'NAN';

    const dateUpdated = new Date(timeUpdated._seconds * 1000);
    const dateCreated = new Date(timeCreated._seconds * 1000);
    const difTimes = dateUpdated.getTime() - dateCreated.getTime();
    const hours = difTimes / (1000 * 60 * 60);
    const days = difTimes / (1000 * 60 * 60 * 24);
    const time = ` ${days.toFixed(3)} días equivalente a ${hours.toFixed(3)} horas`
    return time;
  }

  convertDate(timestamp: any): string {
    return this.generalService.convertDate(timestamp);
  }

  refreshComponent() {
    setTimeout(() => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([this.route.snapshot.url.join('/')]);
      });
    }, 1000);
  }
}
