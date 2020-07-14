import { VASTLinear } from './vast-linear';

describe('VASTLinear', () => {
  it('should create an instance', () => {
    const elementMock = {} as any;
    elementMock.attributes = [{ name: 'id', value: '123' }];
    elementMock.children = [{ nodeType: 1, nodeName: 'Linear', children: [{ nodeType: 1, nodeName: 'Duration', textContent: '00:00:30' }] }];
    expect(new VASTLinear(elementMock)).toBeTruthy();
  });
});
