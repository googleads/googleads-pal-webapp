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

import {convertVASTTimeToMillis} from './common';

export class VASTTracking {
  protected eventInternal: string;

  get event(): string {
    return this.eventInternal;
  }

  protected offsetInternal?: number;

  get offset(): number|undefined {
    return this.offsetInternal;
  }

  protected uriInternal: URL;

  get uri(): URL {
    return this.uriInternal;
  }

  constructor(rootElement: Element) {
    console.debug('Parse Tracking');

    this.eventInternal = this.parseEvent(rootElement);
    this.offsetInternal = this.parseOffset(rootElement);

    if (rootElement.textContent === null) {
      throw new Error('Tracking element must have URI.');
    } else {
      this.uriInternal = new URL(rootElement.textContent);
    }
  }

  private parseEvent(rootElement: Element): string {
    console.info('Parse Tracking@event');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'event') {
        return rootElement.attributes[i].value;
      }
    }

    return '';
  }

  private parseOffset(rootElement: Element): number|undefined {
    console.info('Parse Tracking@offset');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'offset') {
        return convertVASTTimeToMillis(rootElement.attributes[i].value);
      }
    }

    return undefined;
  }
}