import { Component, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatusTask, Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskSelectionService } from '../../services/TaskSelectionService';
import { GetTasksService } from '../../services/GetTasksService';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './table.component.html',
  styleUrl: '../../../styles.css'
})
export class TableComponent {
  constructor(
    private http: HttpClient, 
    private taskSelectionService: TaskSelectionService,
    private getTasksService: GetTasksService,
    private dialog: MatDialog
  ) {}

  url = environment.api
  tasks: Task[] = []

  statusTask = StatusTask.PROGRESS

  totalTasks = 0
  totalTasksInProgress = 0
  totalTasksDone = 0

  openModal(task: Task) {
    this.dialog.open(ModalComponent, {
      width: '80%',
      position: {
        top: '-500px',
        left: '9%',
        right: '5%'
      },
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: task,
    });
  }

  ngOnInit(): void {
    this.getTasks()
  }

  editTask(task: Task): void {
    this.taskSelectionService.setSelectedTask(task);
  }

  getTasks(){
    this.getTasksService.getTasks()
    .subscribe((tasks: Task[]) => {
      this.tasks = tasks
      this.totalTasks = tasks.length
      this.totalTasksDone = this.tasks.filter(task => task.status === StatusTask.DONE).length
      this.totalTasksInProgress = this.tasks.filter(task => task.status === StatusTask.PROGRESS).length
    })
  }

  removeTask(taskId: string){
    this.http.delete(`${this.url}/task/remove/${taskId}`).subscribe({
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

  completeTask(taskId: string){
    this.http.patch(`${this.url}/task/done/${taskId}`, null).subscribe({
      next: response => {
        //Todo show in toolltip
          console.log('Task complete successfully', response);
          this.ngOnInit()
      },
      error: error => {
        //Todo show in toolltip
          console.error('Failed to complete task', error);
      }
    });
  }
}
