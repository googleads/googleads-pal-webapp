import { VASTInLine } from './vast-in-line';

describe('VASTInLine', () => {
  it('should create an instance', () => {
    const elementMock = {} as any;
    elementMock.attributes = [{ name: 'id', value: '123' }];
    elementMock.children = [{ nodeType: 1, nodeName: 'InLine', children: [{ nodeType: 1, nodeName: 'AdSystem', textContent: "System1" },] }];
    expect(new VASTInLine(elementMock)).toBeTruthy();
  });
});
