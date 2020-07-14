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