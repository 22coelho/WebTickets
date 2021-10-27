import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowrequestsComponent } from './showrequests.component';

describe('ShowrequestsComponent', () => {
  let component: ShowrequestsComponent;
  let fixture: ComponentFixture<ShowrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
