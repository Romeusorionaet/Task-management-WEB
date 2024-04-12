import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: '../../../styles.css'
})
export class TableComponent {
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

  removeTask(taskId: string){
    this.http.delete<Task[]>(`${this.url}/task/remove/${taskId}`).subscribe({
      next: response => {
        //Todo show in toolltip
          console.log('Task removed successfully', response);
          this.ngOnInit()
      },
      error: error => {
        //Todo show in toolltip
          console.error('Failed to remove task', error);
      }
  });
  }
}
