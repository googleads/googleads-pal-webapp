import {VASTAd} from './vast-ad';
import {VASTInLine} from './vast-in-line';
import {VASTWrapper} from './vast-wrapper';

export class VASTDocument {
  private versionInternal: string = '';

  private adsInternal: VASTAd[];

  get version(): string {
    return this.versionInternal;
  }

  get ads(): VASTAd[] {
    return this.adsInternal;
  }

  constructor(private doc: XMLDocument) {
    this.adsInternal = [];
    const rootElement = doc.documentElement;

    if (rootElement.nodeType === 1 && rootElement.nodeName === 'VAST') {
      for (let i = 0; i < rootElement.attributes.length; i++) {
        if (rootElement.attributes[i].name === 'version') {
          this.versionInternal = rootElement.attributes[i].value;
          console.info('Version ', this.versionInternal);
        }
      }

      for (let i = 0; i < rootElement.children.length; i++) {
        const elem = rootElement.children[i];

        if (elem.nodeType === 1 && elem.nodeName === 'Ad') {
          console.log('Parse Ad element');

          for (let i = 0; i < elem.children.length; i++) {
            const child = elem.children[i];

            if (child.nodeType === 1 && child.nodeName === 'Wrapper') {
              this.adsInternal.push(new VASTWrapper(elem));
            } else if (child.nodeType === 1 && child.nodeName === 'InLine') {
              this.adsInternal.push(new VASTInLine(elem));
            }
          }
        }
      }
    }
  }
}

