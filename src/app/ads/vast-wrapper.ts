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
