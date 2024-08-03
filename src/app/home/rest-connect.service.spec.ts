import { TestBed } from '@angular/core/testing';

import { RestConnectService } from './rest-connect.service';

describe('RestConnectService', () => {
  let service: RestConnectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestConnectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
