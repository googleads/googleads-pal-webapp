import { LinearAdsDirective } from './linear-ads.directive';

describe('LinearAdsDirective', () => {
  it('should create an instance', () => {
    const containerRefSpy = {} as any;
    const directive = new LinearAdsDirective(containerRefSpy);
    expect(directive).toBeTruthy();
  });
});
