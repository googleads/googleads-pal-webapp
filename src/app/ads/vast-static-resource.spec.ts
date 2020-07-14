import { VASTStaticResource } from './vast-static-resource';

describe('VASTStaticResource', () => {
  it('should create an instance', () => {
    const elementMock = {} as any;
    elementMock.attributes = [{name: "creativeType", value: "test"}];
    elementMock.textContent = 'https://google.com/resource';
    expect(new VASTStaticResource(elementMock)).toBeTruthy();
  });
});
