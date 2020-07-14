import { VASTAd } from './vast-ad';

describe('VASTAd', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.children = [{nodeType: 1, nodeName: 'Wrapper', children: [{nodeType: 1, nodeName: "AdSystem", textContent: "Test"}]}];
    elementSpy.attributes = [];
    expect(new VASTAd(elementSpy)).toBeTruthy();
  });
});
