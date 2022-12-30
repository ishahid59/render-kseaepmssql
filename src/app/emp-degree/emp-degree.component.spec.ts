import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpdegreeComponent } from './emp-degree.component';

describe('EmpdegreeComponent', () => {
  let component: EmpdegreeComponent;
  let fixture: ComponentFixture<EmpdegreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpdegreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpdegreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
