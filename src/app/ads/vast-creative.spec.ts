import { VASTCreative } from './vast-creative';

describe('VASTCreative', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.attributes = [];
    expect(new VASTCreative(elementSpy)).toBeTruthy();
  });
});
