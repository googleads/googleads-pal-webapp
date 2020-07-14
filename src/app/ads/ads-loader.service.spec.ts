import { TestBed } from '@angular/core/testing';

import { AdsLoaderService } from './ads-loader.service';
import { PalService } from './pal.service';
import { HttpClient } from '@angular/common/http';

describe('AdsLoaderService', () => {
  let service: AdsLoaderService;
  let palServiceSpy: jasmine.SpyObj<PalService>;

  beforeEach(() => {
    const palServiceSpy = jasmine.createSpyObj('PalService', ['getValue']);
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        AdsLoaderService,
        { provide: PalService, useValue: palServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
      ]
    });

    service = TestBed.inject(AdsLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
