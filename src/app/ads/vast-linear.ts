import {convertVASTTimeToMillis} from './common';
import {VASTCreative} from './vast-creative';
import {createVASTIcon, VASTIcon} from './vast-icon';
import {VASTMediaFile} from './vast-media-file';
import {VASTVideoClicks, createVASTVideoClicks} from './vast-video-clicks';

export class VASTLinear extends VASTCreative {
  protected durationInternal: number;

  get duration(): number {
    return this.durationInternal;
  }

  protected mediaFilesInternal: VASTMediaFile[];

  get mediaFiles(): VASTMediaFile[] {
    return this.mediaFilesInternal;
  }

  protected videoClicksInternal?: VASTVideoClicks;

  get videoClicks(): VASTVideoClicks|undefined {
    return this.videoClicksInternal;
  }

  protected iconsInternal: VASTIcon[];

  get icons(): VASTIcon[] {
    return this.iconsInternal;
  }

  constructor(rootElement: Element) {
    super(rootElement);
    console.debug('Parse Linear');
    const linearElement = this.findLinearElement(rootElement);
    this.durationInternal = this.parseDuration(linearElement);
    this.mediaFilesInternal = this.parseMediaFiles(linearElement);
    this.trackingEventsInternal = this.parseTrackingEvents(linearElement);
    this.videoClicksInternal = this.parseVideoClicks(linearElement);
    this.iconsInternal = this.parseIcons(linearElement);
  }

  protected findLinearElement(rootElement: Element): Element {
    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Linear') {
        return child;
      }
    }

    throw new Error('Creative element must have Linear element.');
  }

  protected parseDuration(rootElement: Element): number {
    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Duration') {
        if (!child.textContent) {
          throw new Error('Duration has empty text content.');
        } else if (child.textContent.split(':').length !== 3) {
          throw new Error('Duration value is not in HH:MM:SS.mmm format.');
        }

        const duration = convertVASTTimeToMillis(child.textContent);

        console.debug('Linear duration ', duration);
        return duration;
      }
    }

    throw new Error('Linear element must have Duration.');
  }

  protected parseVideoClicks(rootElement: Element): VASTVideoClicks|undefined {
    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'VideoClicks') {
        return createVASTVideoClicks(child);
      }
    }

    return undefined;
  }

  protected parseMediaFiles(rootElement: Element): VASTMediaFile[] {
    console.debug('Parse MediaFiles');
    const mediaFilesInternal: VASTMediaFile[] = [];

    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'MediaFiles') {
        for (let j = 0; j < child.children.length; j++) {
          if (child.children[j].nodeType === 1 &&
              child.children[j].nodeName === 'MediaFile') {
            mediaFilesInternal.push(new VASTMediaFile(child.children[j]));
          }
        }

        return mediaFilesInternal;
      }
    }

    return mediaFilesInternal;
  }

  protected parseIcons(rootElement: Element): VASTIcon[] {
    console.debug('Parse Icons');
    const icons: VASTIcon[] = [];

    for (let i = 0; i < rootElement.children.length; i++) {
      const child = rootElement.children[i];

      if (child.nodeType === 1 && child.nodeName === 'Icons') {
        for (let j = 0; j < child.children.length; j++) {
          if (child.children[j].nodeType === 1 &&
              child.children[j].nodeName === 'Icon') {
            icons.push(createVASTIcon(child.children[j]));
          }
        }
      }
    }

    return icons;
  }
}
