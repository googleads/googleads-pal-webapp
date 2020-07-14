import {VASTCompanion} from './vast-companion';
import {VASTCreative} from './vast-creative';

export class VASTCompanionAds extends VASTCreative {
    private companionsInternal: VASTCompanion[];
  
    get companions(): VASTCompanion[] {
      return [...this.companionsInternal];
    }
  
    get staticCompanions(): VASTCompanion[] {
      return this.companionsInternal.filter(c => c.staticResource !== undefined);
    }
  
    constructor(rootElement: Element) {
      super(rootElement);
      console.debug('Parse CompanionAds');
      const companionAdsElement = this.findCompanionAdsElement(rootElement);
      this.companionsInternal = this.parseCompanions(companionAdsElement);
    }
  
    protected findCompanionAdsElement(rootElement: Element): Element {
      for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];
  
        if (child.nodeType === 1 && child.nodeName === 'CompanionAds') {
          return child;
        }
      }
  
      throw new Error('Creative element must have CompanionAds element.');
    }
  
    protected parseCompanions(rootElement: Element): VASTCompanion[] {
      console.debug('Parse Companions');
      const companionsInternal: VASTCompanion[] = [];
  
      for (let i = 0; i < rootElement.children.length; i++) {
        const child = rootElement.children[i];
  
        if (child.nodeType === 1 && child.nodeName === 'Companion') {
          companionsInternal.push(new VASTCompanion(child));
        }
      }
  
      return companionsInternal;
    }
  }
