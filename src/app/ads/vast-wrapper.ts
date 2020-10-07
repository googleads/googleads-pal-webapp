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

import {VASTAd} from './vast-ad';
import {VASTDocument} from './vast-document';

export class VASTWrapper extends VASTAd {
    private vastAdTagURIInternal: URL;
  
    get vastAdTagURI(): URL {
      return this.vastAdTagURIInternal;
    }
  
    private vastInternal?: VASTDocument;
  
    get vast(): VASTDocument|undefined {
      return this.vastInternal;
    }
  
    set vast(vast: VASTDocument|undefined) {
      this.vastInternal = vast;
    }
  
    constructor(rootElement: Element) {
      super(rootElement);
      console.debug('Parse Wrapper');
  
      const wrapperElement = this.findInLineOrWrapperElement(rootElement);
      this.vastAdTagURIInternal = this.parseVASTAdTagURI(wrapperElement);
    }
  
    parseVASTAdTagURI(wrapperElement: Element): URL {
      for (let i = 0; i < wrapperElement.children.length; i++) {
        const child = wrapperElement.children[i];
  
        if (child.nodeType === 1 && child.nodeName === 'VASTAdTagURI') {
          if (!child.textContent) {
            throw new Error('VASTAdTagURI has empty text content.');
          }
  
          return new URL(child.textContent);
        }
      }
  
      throw new Error('VASTAdTagURI required element not found in wrapper.');
    }
  }
