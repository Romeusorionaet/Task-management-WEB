import { Component, Input, } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { StatusTask, Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskSelectionService } from '../../services/TaskSelectionService';
import { GetTasksService } from '../../services/GetTasksService';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatIconModule } from '@angular/material/icon';
import { UtilService } from '../../services/UtilService';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule, 
    ModalComponent, 
    MatIconModule
  ],
  templateUrl: './table.component.html',
  styleUrl: '../../../styles.css'
})
export class TableComponent {
  
  @Input() tasksSearch: Task[] = []
  
  url = environment.api
  tasks: Task[] = []

  statusTask = StatusTask.PROGRESS

  totalTasks = 0
  totalTasksInProgress = 0
  totalTasksDone = 0

  blockedVisibility = false

  constructor(
    private http: HttpClient, 
    private taskSelectionService: TaskSelectionService,
    private getTasksService: GetTasksService,
    private dialog: MatDialog,
    private utilService: UtilService
  ) {}

  ngOnInit() {
    this.getTasks()
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

  openModal(task: Task) {
    this.blockedVisibility = true

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '90%',
      position: {
        top: '10%',
        left: '9%',
        right: '5%'
      },
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '200ms',
      data: task,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Closed using function') {
        this.blockedVisibility = false
      }
    })
  }

  editTask(task: Task): void {
    this.taskSelectionService.setSelectedTask(task)
  }

  removeTask(taskId: string){
    this.forceReload() 

    this.http.delete(`${this.url}/task/remove/${taskId}`).subscribe({
      next: _ => {
          this.getTasks()
      },
      error: error => {
          console.error('Failed to remove task', error);
      }
    })
  }

  completeTask(taskId: string){
    this.forceReload()

    this.http.patch(`${this.url}/task/done/${taskId}`, null).subscribe({
      next: _ => {
          this.getTasks()
      },
      error: error => {
          console.error('Failed to complete task', error);
      }
    })
  }

  getPriorityText(priority: string): string {
    return this.utilService.getPriorityText(priority)
  }

  forceReload() {
    if(this.tasksSearch.length != 0) {
      window.location.reload()
    }
  }
}
