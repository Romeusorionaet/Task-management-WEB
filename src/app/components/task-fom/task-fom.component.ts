import { HttpClient } from '@angular/common/http';
import { Component, Inject, LOCALE_ID  } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Task } from '../../models/task.model';
import { CommonModule, formatDate } from '@angular/common';

@Component({
  selector: 'app-task-fom',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-fom.component.html',
})
export class TaskFomComponent {

  url = `${environment.api}/task`
  taskForm: FormGroup
  isFormSubmitted: boolean = false
  priorities: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string,) {
    this.taskForm = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.minLength(3)]),
      description: new FormControl("", [Validators.required, Validators.minLength(10)]),
      responsibleUser: new FormControl("", [Validators.required]),
      priority: new FormControl("", [Validators.required]),
      deadline: new FormControl("", [Validators.required, this.deadlineValidator()]),
    })
  }
  
  onSubmit() {
    this.taskForm.markAllAsTouched()
    const isFormValid = this.taskForm.valid

    if(isFormValid){
      const task: Task = this.taskForm.value

      task.deadline = formatDate(task.deadline, 'yyyy-MM-ddTHH:mm:ss', this.locale);

      console.log(task.deadline, '====7776')
      this.http.post<Task>(`${this.url}/create`, task).subscribe({
        next: response => {
          //Todo show in toolltip
          console.log('Request successful', response);
          this.taskForm.reset();
        },
        error: error => {
          //Todo show in toolltip
          if (error.status === 400 && error.error) {
            console.error(error.status, error.error);
          } else {
            console.error('Request failed', error.message);
          }
        }
      });
    }
  }

  deadlineValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const deadline = new Date(control.value);
      const currentDate = new Date();
  
      currentDate.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      if (deadline < tomorrow) {
        return { 'minDeadline': true }; 
      }
      return null; 
    };
  }
}
