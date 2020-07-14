import { CompanionAdsDirective } from './companion-ads.directive';

describe('CompanionAdsDirective', () => {
  it('should create an instance', () => {
    const containerRefSpy = {} as any;
    const directive = new CompanionAdsDirective(containerRefSpy);
    expect(directive).toBeTruthy();
  });
});
