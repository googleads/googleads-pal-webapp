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

import {VASTCompanion} from './vast-companion';
import {VASTCreative} from './vast-creative';

export class VASTCompanionAds extends VASTCreative {
    private companionsInternal: VASTCompanion[];
  
    get companions(): VASTCompanion[] {
      return [...this.companionsInternal];
    }
  
    get staticCompanions(): VASTCompanion[] {
      return this.companionsInternal.filter(c => c.staticResource !== undefined);
    }
  
    constructor(rootElement: Element) {
      super(rootElement);
      console.debug('Parse CompanionAds');
      const companionAdsElement = this.findCompanionAdsElement(rootElement);
      this.companionsInternal = this.parseCompanions(companionAdsElement);
    }
  
    protected findCompanionAdsElement(rootElement: Element): Element {
      for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];
  
        if (child.nodeType === 1 && child.nodeName === 'CompanionAds') {
          return child;
        }
      }
  
      throw new Error('Creative element must have CompanionAds element.');
    }
  
    protected parseCompanions(rootElement: Element): VASTCompanion[] {
      console.debug('Parse Companions');
      const companionsInternal: VASTCompanion[] = [];
  
      for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];
  
        if (child.nodeType === 1 && child.nodeName === 'Companion') {
          companionsInternal.push(new VASTCompanion(child));
        }
      }
  
      return companionsInternal;
    }
  }
