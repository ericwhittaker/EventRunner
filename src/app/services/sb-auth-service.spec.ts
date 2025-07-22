import { TestBed } from '@angular/core/testing';

import { SbAuthService } from './sb-auth-service';

describe('SbAuthService', () => {
  let service: SbAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
