import { TestBed } from '@angular/core/testing';

import { PenaltyServiceService } from './penalty-service.service';

describe('PenaltyServiceService', () => {
  let service: PenaltyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PenaltyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
