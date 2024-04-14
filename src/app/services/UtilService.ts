import { Injectable } from '@angular/core';
import { PriorityTask } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  getPriorityText(priority: string): string {
    switch (priority) {
      case PriorityTask.LOW:
        return 'Baixa';
      case PriorityTask.MEDIUM:
        return 'Média';
      case PriorityTask.HIGH:
        return 'Alta';
      default:
        return '';
    }
  }
}
