import { VASTWrapper } from './vast-wrapper';

describe('VASTWrapper', () => {
  it('should create an instance', () => {
    const elementMock = {} as any;
    elementMock.attributes = [{ name: 'id', value: '123' }];
    elementMock.children = [{ nodeType: 1, nodeName: 'Wrapper', children: [{ nodeType: 1, nodeName: 'AdSystem', textContent: "System1" }, {nodeType: 1, nodeName: "VASTAdTagURI", textContent: 'https://google.com/vast.xml'}] }];
    expect(new VASTWrapper(elementMock)).toBeTruthy();
  });
});
