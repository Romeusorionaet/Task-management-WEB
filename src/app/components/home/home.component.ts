import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, TableComponent],
  templateUrl: './home.component.html',
  styleUrl: '../../../styles.css'
})
export class HomeComponent {
}
