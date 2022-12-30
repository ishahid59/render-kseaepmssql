import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpEditModalComponent } from './emp-edit-modal.component';

describe('EmpEditModalComponent', () => {
  let component: EmpEditModalComponent;
  let fixture: ComponentFixture<EmpEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpEditModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
