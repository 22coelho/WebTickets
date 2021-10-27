import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySavedEventsComponent } from './my-saved-events.component';

describe('MySavedEventsComponent', () => {
  let component: MySavedEventsComponent;
  let fixture: ComponentFixture<MySavedEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySavedEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySavedEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
