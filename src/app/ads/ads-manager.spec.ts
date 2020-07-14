import { AdsManager } from './ads-manager';

describe('AdsManager', () => {
  it('should create an instance', () => {
    const vastDocumentSpy = {} as any;
    const componentFactoryResolverSpy = {} as any;
    const adDisplayContainerSpy = {} as any;
    const httpClientSpy = {} as any;
    expect(new AdsManager(vastDocumentSpy, componentFactoryResolverSpy, adDisplayContainerSpy, httpClientSpy)).toBeTruthy();
  });
});
