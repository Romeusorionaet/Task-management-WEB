import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: '../../../styles.css'
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) {}

  url = environment.api
  tasks: Task[] = []
  ngOnInit(): void {
    this.getTasks()
  }

  getTasks(){
    this.http.get<Task[]>(`${this.url}/task/get-tasks`)
    .subscribe((tasks: Task[]) => {
      this.tasks = tasks
    })
  }
}
