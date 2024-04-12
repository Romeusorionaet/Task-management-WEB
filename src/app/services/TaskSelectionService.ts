import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskSelectionService {
  private selectedTaskSubject: BehaviorSubject<Task | null> = new BehaviorSubject<Task | null>(null);
  selectedTask$ = this.selectedTaskSubject.asObservable();

  constructor() { }

  setSelectedTask(task: Task): void {
    this.selectedTaskSubject.next(task);
  }

  getSelectedTask(): Task | null {
    return this.selectedTaskSubject.getValue();
  }
}
