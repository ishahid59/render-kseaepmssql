import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPhotoComponent } from './pro-photo.component';

describe('ProPhotoComponent', () => {
  let component: ProPhotoComponent;
  let fixture: ComponentFixture<ProPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProPhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
