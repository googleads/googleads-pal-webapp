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

import { LinearAdsReporter } from './linear-ads-reporter';
import { HttpClient } from '@angular/common/http';
import { LinearAdRendererComponent } from './linear-ad-renderer/linear-ad-renderer.component';

describe('LinearAdReporter', () => {
  it('should create an instance', () => {
    const httpClientSpy = {} as any;
    const linearAdRendererSpy = {} as any;
    linearAdRendererSpy.loadedData = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.playStart = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.timeUpdate = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.iconView = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.iconClick = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    expect(new LinearAdsReporter(httpClientSpy, linearAdRendererSpy)).toBeTruthy();
  });
});
