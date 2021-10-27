import { TestBed } from '@angular/core/testing';

import { RestEventsService } from './rest-events.service';

describe('RestEventsService', () => {
  let service: RestEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
