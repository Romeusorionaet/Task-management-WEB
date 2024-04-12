import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TableComponent } from '../table/table.component';
import { TaskFomComponent } from '../task-fom/task-fom.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TableComponent, TaskFomComponent],
  templateUrl: './home.component.html',
  styleUrl: '../../../styles.css'
})
export class HomeComponent {
}
