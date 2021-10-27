import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInsertPasswordComponent } from './dialog-insert-password.component';

describe('DialogInsertPasswordComponent', () => {
  let component: DialogInsertPasswordComponent;
  let fixture: ComponentFixture<DialogInsertPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInsertPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInsertPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
