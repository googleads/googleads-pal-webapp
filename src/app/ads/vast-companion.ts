import {assertString} from './common';

import {VASTStaticResource} from './vast-static-resource';
import {VASTTracking} from './vast-tracking';

export class VASTCompanion {
  private idInternal?: string;

  get id(): string|undefined {
    return this.idInternal;
  }

  private widthInternal: number;

  get width(): number {
    return this.widthInternal;
  }

  private heightInternal: number;

  get height(): number {
    return this.heightInternal;
  }

  private staticResourceInternal: VASTStaticResource;

  get staticResource(): VASTStaticResource {
    return this.staticResourceInternal;
  }

  protected trackingEventsInternal: VASTTracking[] = [];

  get trackingEvents(): VASTTracking[] {
    return this.trackingEventsInternal;
  }

  protected companionClickThroughInternal?: URL;

  get companionClickThrough(): URL|undefined {
    return this.companionClickThroughInternal;
  }

  constructor(rootElement: Element) {
    this.idInternal = this.parseId(rootElement);
    this.widthInternal = this.parseWidth(rootElement);
    this.heightInternal = this.parseHeight(rootElement);
    this.staticResourceInternal = this.parseStaticResource(rootElement);
    this.trackingEventsInternal = this.parseTrackingEvents(rootElement);
    this.companionClickThroughInternal =
        this.parseCompanionClickThrough(rootElement);
  }

  private parseId(rootElement: Element): string|undefined {
    console.info('Parse Companion@id');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'id') {
        return rootElement.attributes[i].value;
      }
    }

    return undefined;
  }

  private parseWidth(rootElement: Element): number {
    console.info('Parse Companion@width');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'width') {
        return Number(rootElement.attributes[i].value);
      }
    }

    throw new Error('Companion@width required attribute is missing.');
  }

  private parseHeight(rootElement: Element): number {
    console.info('Parse Companion@height');

    for (let i = 0; i < rootElement.attributes.length; i++) {
      if (rootElement.attributes[i].name === 'height') {
        return Number(rootElement.attributes[i].value);
      }
    }

    throw new Error('Companion@height required attribute is missing.');
  }

  protected parseStaticResource(rootElement: Element): VASTStaticResource {
    console.debug('Parse StaticResource');

    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'StaticResource') {
        return new VASTStaticResource(child);
      }
    }

    throw new Error('Companion@StaticResource required element is missing.');
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

    return trackingEvents;
  }

  protected parseCompanionClickThrough(rootElement: Element): URL|undefined {
    console.debug('Parse Companion@CompanionClickThrough');

    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'CompanionClickThrough') {
        assertString(child.textContent);
        return new URL(child.textContent);
      }
    }

    return undefined;
  }
}
