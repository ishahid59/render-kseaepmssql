import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpRegComponent } from './emp-reg.component';

describe('EmpRegComponent', () => {
  let component: EmpRegComponent;
  let fixture: ComponentFixture<EmpRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpRegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
