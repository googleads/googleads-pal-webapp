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

import { VASTAd } from './vast-ad';

describe('VASTAd', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.children = [{nodeType: 1, nodeName: 'Wrapper', children: [{nodeType: 1, nodeName: "AdSystem", textContent: "Test"}]}];
    elementSpy.attributes = [];
    expect(new VASTAd(elementSpy)).toBeTruthy();
  });
});
