import { TestBed } from '@angular/core/testing';

import { SbDataService } from './sb-data-service';

describe('SbDataService', () => {
  let service: SbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SbDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
