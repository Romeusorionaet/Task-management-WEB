import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFomComponent } from './task-fom.component';

describe('TaskFomComponent', () => {
  let component: TaskFomComponent;
  let fixture: ComponentFixture<TaskFomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFomComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskFomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
