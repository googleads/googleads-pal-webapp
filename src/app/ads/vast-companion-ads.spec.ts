import { VASTCompanionAds } from './vast-companion-ads';

describe('VASTCompanionAds', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.attributes = [{name: 'id', value: '123'}];
    elementSpy.children = [{nodeType: 1, nodeName: 'CompanionAds', children: []}];
    expect(new VASTCompanionAds(elementSpy)).toBeTruthy();
  });
});
