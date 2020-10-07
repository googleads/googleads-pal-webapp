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

import {VASTCompanionAds} from './vast-companion-ads';
import {VASTCreative} from './vast-creative';
import {VASTLinear} from './vast-linear';

export class VASTAd {
  protected idInternal?: string;

  get id(): string|undefined {
    return this.idInternal;
  }

  protected adSystemInternal: string;

  get adSystem(): string {
    return this.adSystemInternal;
  }

  protected errorsInternal: URL[];

  get errors(): URL[] {
    return this.errorsInternal;
  }

  protected impressionsInternal: URL[];

  get impressions(): URL[] {
    return this.impressionsInternal;
  }

  protected creativesInternal: VASTCreative[];

  get creatives(): VASTCreative[] {
    return this.creativesInternal;
  }

  get linearCreative(): VASTLinear|undefined {
    const linearCreatives =
        this.creativesInternal
            .filter(creative => creative instanceof VASTLinear)
            .flatMap(creative => creative as VASTLinear);

    if (linearCreatives.length > 0) {
      return linearCreatives[0];
    } else {
      return undefined;
    }
  }

  get companionAds(): VASTCompanionAds|undefined {
    const filtered =
        this.creativesInternal
            .filter(creative => creative instanceof VASTCompanionAds)
            .flatMap(creative => creative as VASTCompanionAds);

    if (filtered.length) {
      return filtered[0];
    } else {
      return undefined;
    }
  }

  constructor(protected rootElement: Element) {
    this.idInternal = this.parseId(rootElement);
    const inLineOrWrapperElem = this.findInLineOrWrapperElement(rootElement);
    this.adSystemInternal = this.parseAdSystem(inLineOrWrapperElem);
    this.errorsInternal = this.parseError(inLineOrWrapperElem);
    this.impressionsInternal = this.parseImpression(inLineOrWrapperElem);
    this.creativesInternal = this.parseCreatives(inLineOrWrapperElem);
  }

  protected parseId(rootElement: Element): string|undefined {
    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'id') {
        console.log('Parse Ad.id attribute');
        return rootElement.attributes[i].value;
      }
    }

    return undefined;
  }

  protected findInLineOrWrapperElement(rootElement: Element): Element {
    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 &&
          (child.nodeName === 'Wrapper' || child.nodeName === 'InLine')) {
        return child;
      }
    }

    throw new Error('Ad element must have InLine or Wrapper element.');
  }

  protected parseAdSystem(inLineOrWrapperElement: Element): string {
    for (let i = 0; i < inLineOrWrapperElement.children.length; i++) {
      const elem = inLineOrWrapperElement.children[i];

      console.debug('node type: ', elem.nodeType, 'node name: ', elem.nodeName);

      if (elem.nodeType === 1 && elem.nodeName === 'AdSystem') {
        if (elem.textContent == null) {
          throw new Error(
              'The ad serving party must provide a descriptive name for the system that serves the ad.');
        }

        return elem.textContent;
      }
    }

    throw new Error('AdSystem element doesn\'t exist.');
  }

  parseError(inLineOrWrapperElement: Element): URL[] {
    const errors: URL[] = [];

    for (let i = 0; i < inLineOrWrapperElement.children.length; i++) {
      const child = inLineOrWrapperElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Error') {
        if (!child.textContent) {
          throw new Error('Error has empty text content.');
        }

        errors.push(new URL(child.textContent));
      }
    }

    return errors;
  }

  parseImpression(inLineOrWrapperElement: Element): URL[] {
    const impressions: URL[] = [];

    for (let i = 0; i < inLineOrWrapperElement.children.length; i++) {
      const child = inLineOrWrapperElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Impression') {
        if (!child.textContent) {
          throw new Error('Impression has empty text content.');
        }

        impressions.push(new URL(child.textContent));
      }
    }

    return impressions;
  }

  parseCreatives(inLineOrWrapperElement: Element): VASTCreative[] {
    const creatives: VASTCreative[] = [];

    for (let i = 0; i < inLineOrWrapperElement.children.length; i++) {
      const child = inLineOrWrapperElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Creatives') {
        for (let j = 0; j < child.children.length; j++) {
          const creativeElement = child.children[j];
          creatives.push(this.parseCreative(creativeElement));
        }
      }
    }

    return creatives;
  }

  parseCreative(creativeElement: Element): VASTCreative {
    for (let i = 0; i < creativeElement.children.length; i++) {
      const child = creativeElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Linear') {
        return new VASTLinear(creativeElement);
      } else if (child.nodeType === 1 && child.nodeName === 'CompanionAds') {
        return new VASTCompanionAds(creativeElement);
      }
    }

    throw new Error('Failed to create VASTCreative due to unknown element.');
  }
}
