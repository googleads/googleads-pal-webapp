import { CompanionAdsReporter } from './companion-ads-reporter';

describe('CompanionAdsReporter', () => {
  it('should create an instance', () => {
    const httpClientSpy = {} as any;
    const companionAdRendererSpy = {} as any;
    companionAdRendererSpy.adClicked = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    companionAdRendererSpy.loaded = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    expect(new CompanionAdsReporter(httpClientSpy, companionAdRendererSpy)).toBeTruthy();
  });
});
