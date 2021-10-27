import { TestBed } from '@angular/core/testing';

import { RestProfilesService } from './rest-profiles.service';

describe('RestProfilesService', () => {
  let service: RestProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
