import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreinfoEventComponent } from './moreinfo-event.component';

describe('MoreinfoEventComponent', () => {
  let component: MoreinfoEventComponent;
  let fixture: ComponentFixture<MoreinfoEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreinfoEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreinfoEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
