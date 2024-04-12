import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetTasksService {
  constructor(private http: HttpClient) { }

  url = environment.api

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.url}/task/get-tasks`);
  }
}
