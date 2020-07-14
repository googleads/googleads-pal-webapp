import { TestBed } from '@angular/core/testing';

import { PalService } from './pal.service';

declare namespace goog {
  
}

describe('PalService', () => {
  let service: PalService;

  beforeEach(() => {
    const goog = {
      pal: {
        NonceLoader: {

        },
        NonceManager: {

        }
      }
    }
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
