/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
