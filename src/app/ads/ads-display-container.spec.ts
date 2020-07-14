import { AdsDisplayContainer } from './ads-display-container';

describe('AdsDisplayContainer', () => {
  it('should create an instance', () => {
    const elementRefSpy = {} as any;
    const linearAdsDirectiveSpy = {} as any;
    const companionAdsDirectiveSpy = {} as any;
    expect(new AdsDisplayContainer(elementRefSpy, linearAdsDirectiveSpy, companionAdsDirectiveSpy)).toBeTruthy();
  });
});
