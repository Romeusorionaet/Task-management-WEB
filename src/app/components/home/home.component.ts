import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TableComponent } from '../table/table.component';
import { TaskFomComponent } from '../task-fom/task-fom.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TableComponent, TaskFomComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: '../../../styles.css'
})
export class HomeComponent {
  
  taskForm: FormGroup

  tasksSearch: Task[] = []
  
  url = `${environment.api}/task`
  
  constructor(private http: HttpClient, ) {
    this.taskForm = new FormGroup({
      titleOrDescription: new FormControl(""),
      responsibleUser: new FormControl(""),
      priority: new FormControl(""),
      status: new FormControl(""),
    })
  }

  onSubmit() {
    this.taskForm.markAllAsTouched()
    const query = this.taskForm.value

    let params = new HttpParams()
    Object.keys(query).forEach(key => {
      params = params.append(key, query[key] || '')
    })
 
    this.http.get<Task[]>(`${this.url}/search`, {params}).subscribe({
      next: response => {
        this.tasksSearch = response
        //Todo show in toolltip
        console.log('Request successful', response)
      },
      error: error => {
        //Todo show in toolltip
        if (error.status === 400 && error.error) {
          console.error(error.status, error.error)
        } else {
          console.error('Request failed', error.message)
        }
      }
    })
  }
}
