import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JquerydatatableComponent } from './jquerydatatable.component';

describe('JquerydatatableComponent', () => {
  let component: JquerydatatableComponent;
  let fixture: ComponentFixture<JquerydatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JquerydatatableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JquerydatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
