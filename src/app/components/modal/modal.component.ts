import { Component, Inject, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { StatusTask, Task } from '../../models/task.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {

  task: Task
  status = ''

  constructor(
    private ref: MatDialogRef<ModalComponent>, 
    @Inject(LOCALE_ID) public locale: 'pt-br',
    @Inject(MAT_DIALOG_DATA) data: Task) {
      this.task = data

      if(this.task.status === StatusTask.PROGRESS){
        this.status = 'Em andamento'
      }else{
        this.status = 'Concluída'
      }
  }
  
  closeModal() {
    this.ref.close('Closed using function');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return formatDate(date, 'dd/MM/yyyy', this.locale);
  }
}
