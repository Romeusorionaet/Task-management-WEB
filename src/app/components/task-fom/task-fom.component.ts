import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID  } from '@angular/core';
import { 
  AbstractControl, 
  FormControl, 
  FormGroup, 
  ReactiveFormsModule, 
  ValidatorFn, 
  Validators 
} from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Task } from '../../models/task.model';
import { CommonModule, formatDate } from '@angular/common';
import { TaskSelectionService } from '../../services/TaskSelectionService';

@Component({
  selector: 'app-task-fom',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-fom.component.html',
})
export class TaskFomComponent {

  url = `${environment.api}/task`

  taskForm: FormGroup

  selectedTask: Task | null = null

  editingMode: boolean = false

  isFormSubmitted: boolean = false

  constructor(
    private http: HttpClient, 
    @Inject(LOCALE_ID) public locale: 'pt-br',
    private taskSelectionService: TaskSelectionService,
  ) {
    this.taskForm = new FormGroup({
      id: new FormControl(""),
      title: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      description: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]),
      responsibleUser: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      deadline: new FormControl("", [Validators.required, this.deadlineValidator()]),
      createdAt: new FormControl(""),
    })
  }

  ngOnInit(): void {
    this.taskSelectionService.selectedTask$.subscribe(task => {
      if (task) {
        this.transferTaskForEdit(task)
      }
    })
  }

  transferTaskForEdit(task: Task): void {
    this.editingMode = true;
    this.scrollToTop();
    task.deadline = formatDate(task.deadline, 'yyyy-MM-dd', this.locale);
    this.selectedTask = task;
    this.updateForm();
  }

  updateForm(): void {
    if (this.selectedTask) {
      this.taskForm.patchValue({
        id: this.selectedTask.id,
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        deadline: this.selectedTask.deadline,
        priority: this.selectedTask.priority,
        responsibleUser: this.selectedTask.responsibleUser,
        createdAt: this.selectedTask.createdAt
      });
    } else {
      this.taskForm.reset()
    }
  }
  
  onSubmit() {
    this.taskForm.markAllAsTouched()
    const isFormValid = this.taskForm.valid
    
    if(isFormValid){
      const task: Task = this.taskForm.value

      task.deadline = formatDate(task.deadline, 'yyyy-MM-ddTHH:mm:ss', this.locale)

      this.http.post<Task>(`${this.url}/create`, task).subscribe({
        next: _ => {
          //Todo show in toolltip
          console.log('Request successful')
          this.taskForm.reset()
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

  onEdit() {
    this.editingMode = true
    this.taskForm.markAllAsTouched()
    const isFormValid = this.taskForm.valid

    if (isFormValid && this.selectedTask) {
      const editedTask: Task = this.taskForm.value;
      editedTask.deadline = formatDate(editedTask.deadline, 'yyyy-MM-ddTHH:mm:ss', this.locale)

      this.http.put<Task>(`${this.url}/update`, editedTask).subscribe({
        next: response => {
          //Todo show in toolltip
          console.log('Edit request successful', response)
          this.taskForm.reset();
          this.selectedTask = null
          this.editingMode = false

          this.scrollToBottom()
          
          setTimeout(() => {
            window.location.reload()
          }, 500)
        },
        error: error => {
          if (error.status === 400 && error.error) {
            //Todo show in toolltip
            console.error(error.status, error.error)
          } else {
            console.error('Edit request failed', error.message)
          }
        }
      })
    }
  }

  deadlineValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const deadline = new Date(control.value)
      const currentDate = new Date();
  
      currentDate.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1)
  
      if (deadline < tomorrow) {
        return { 'minDeadline': true }
      }
      return null; 
    }
  }

  scrollToTop(): void {
    const scrollToTop = window.setInterval(() => {
      const pos = window.scrollY;
      if (pos > 0) {
        window.scrollTo(0, pos - 20)
      } else {
        window.clearInterval(scrollToTop)
      }
    }, 10)
  }

  scrollToBottom(): void {
    const scrollToBottom = window.setInterval(() => {
      const pos = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (pos + windowHeight < documentHeight) {
        window.scrollTo(0, pos + 20);
      } else {
        window.clearInterval(scrollToBottom);
      }
    }, 10);
  }
}
