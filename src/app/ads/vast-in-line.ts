import {VASTAd} from './vast-ad';

export class VASTInLine extends VASTAd {
  constructor(rootElement: Element) {
    super(rootElement);
    console.debug('Parse InLine');
  }
}
