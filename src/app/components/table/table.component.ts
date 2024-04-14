import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PriorityTask, StatusTask, Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';
import { TaskSelectionService } from '../../services/TaskSelectionService';
import { GetTasksService } from '../../services/GetTasksService';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ModalComponent, MatIconModule],
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

  @Input() tasksSearch: Task[] = []
  @Output() taskSelected: EventEmitter<Task> = new EventEmitter<Task>();
  
  url = environment.api
  tasks: Task[] = []

  statusTask = StatusTask.PROGRESS

  totalTasks = 0
  totalTasksInProgress = 0
  totalTasksDone = 0

  ngOnInit(): void {
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

  getPriorityText(priority: string): string {
    switch (priority) {
      case PriorityTask.LOW:
        return 'Baixa'
      case PriorityTask.MEDIUM:
        return 'Média'
      case PriorityTask.HIGH:
        return 'Alta'
      default:
        return ''
    }
  }

  openModal(task: Task) {
    this.dialog.open(ModalComponent, {
      width: '90%',
      position: {
        top: '150px',
        left: '9%',
        right: '5%'
      },
      enterAnimationDuration: '100ms',
      exitAnimationDuration: '200ms',
      data: task,
    });
  }

  editTask(task: Task): void {
    this.taskSelectionService.setSelectedTask(task)
    this.taskSelected.emit(task)
  }

  removeTask(taskId: string){
    this.http.delete(`${this.url}/task/remove/${taskId}`).subscribe({
      next: _ => {
        //Todo show in toolltip
          console.log('Task removed successfully');
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
      next: _ => {
        //Todo show in toolltip
          console.log('Task complete successfully');
          this.ngOnInit()
      },
      error: error => {
        //Todo show in toolltip
          console.error('Failed to complete task', error);
      }
    });
  }
}
