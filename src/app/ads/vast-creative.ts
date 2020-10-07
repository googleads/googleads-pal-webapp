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

import {VASTTracking} from './vast-tracking';

export class VASTCreative {
  protected idInternal?: string;

  get id(): string|undefined {
    return this.idInternal;
  }

  protected adIdInternal?: string;

  get adId(): string|undefined {
    return this.adIdInternal;
  }

  protected sequenceInternal?: string;

  get sequence(): string|undefined {
    return this.sequenceInternal;
  }

  protected trackingEventsInternal: VASTTracking[] = [];

  get trackingEvents(): VASTTracking[] {
    return this.trackingEventsInternal;
  }

  constructor(rootElement: Element) {
    console.debug('Parse Creative');
    this.idInternal = this.parseId(rootElement);
    this.adIdInternal = this.parseAdId(rootElement);
    this.sequenceInternal = this.parseSequence(rootElement);
  }

  protected parseId(rootElement: Element): string|undefined {
    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'id') {
        console.log('Parse Creative.id attribute');
        return rootElement.attributes[i].value;
      }
    }

    return undefined;
  }

  protected parseAdId(rootElement: Element): string|undefined {
    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'adId') {
        console.log('Parse Creative.adId attribute');
        return rootElement.attributes[i].value;
      }
    }

    return undefined;
  }

  protected parseSequence(rootElement: Element): string|undefined {
    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'sequence') {
        console.log('Parse Creative.sequence attribute');
        return rootElement.attributes[i].value;
      }
    }

    return undefined;
  }

  protected parseTrackingEvents(rootElement: Element): VASTTracking[] {
    console.debug('Parse TrackingEvents');
    const trackingEvents: VASTTracking[] = [];

    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'TrackingEvents') {
        for (let j = 0; j < child.children.length; j++) {
          if (child.children[j].nodeType === 1 &&
              child.children[j].nodeName === 'Tracking') {
            trackingEvents.push(new VASTTracking(child.children[j]));
          }
        }
      }
    }

    return trackingEvents
  }
}