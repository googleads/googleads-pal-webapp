import { VASTTracking } from './vast-tracking';

describe('VASTTracking', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.attributes = [{name: 'event', value: 'firstQuartile'}];
    elementSpy.textContent = "https://www.google.com/track";
    expect(new VASTTracking(elementSpy)).toBeTruthy();
  });
});
