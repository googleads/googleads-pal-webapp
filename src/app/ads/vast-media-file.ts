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

import {VASTDelivery} from './vast-delivery.enum';

export class VASTMediaFile {
  protected deliveryInternal: VASTDelivery;

  get delivery(): VASTDelivery {
    return this.deliveryInternal;
  }

  protected typeInternal: string;

  get type(): string {
    return this.typeInternal;
  }

  protected widthInternal: number;

  get width(): number {
    return this.widthInternal;
  }

  protected heightInternal: number;

  get height(): number {
    return this.heightInternal;
  }

  protected uriInternal: URL;

  get uri(): URL {
    return this.uriInternal;
  }

  constructor(rootElement: Element) {
    console.debug('Parse Mediafile');
    this.deliveryInternal = this.parseDelivery(rootElement);
    this.typeInternal = this.parseType(rootElement);
    this.widthInternal = this.parseWidth(rootElement);
    this.heightInternal = this.parseHeight(rootElement);

    if (rootElement.textContent === null) {
      throw new Error('MediaFile element must have URI.');
    } else {
      this.uriInternal = new URL(rootElement.textContent);
    }
  }

  private parseDelivery(rootElement: Element): VASTDelivery {
    console.info('Parse MediaFile@delivery');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'delivery') {
        if (rootElement.attributes[i].value === 'progressive') {
          return VASTDelivery.PROGRESSIVE;
        } else if (rootElement.attributes[i].value === 'streaming') {
          return VASTDelivery.STREAMING;
        } else {
          throw new Error('Unexpected delivery for MediaFile.');
        }
      }
    }

    throw new Error('MediaFile@delivery required attribute is missing.');
  }

  private parseType(rootElement: Element): string {
    console.info('Parse MediaFile@type');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'type') {
        return rootElement.attributes[i].value;
      }
    }

    throw new Error('MediaFile@type required attribute is missing.');
  }

  private parseWidth(rootElement: Element): number {
    console.info('Parse MediaFile@width');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'width') {
        return Number(rootElement.attributes[i].value);
      }
    }

    throw new Error('MediaFile@width required attribute is missing.');
  }

  private parseHeight(rootElement: Element): number {
    console.info('Parse MediaFile@height');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'height') {
        return Number(rootElement.attributes[i].value);
      }
    }

    throw new Error('MediaFile@height required attribute is missing.');
  }
}
