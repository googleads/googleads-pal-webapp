import { VASTCompanion } from './vast-companion';
import { identity } from 'rxjs';

describe('VASTCompanion', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.attributes = [{name: 'id', value: '123'}, {name: 'width', value: '320'}, {name: 'height', value: '299'}];
    elementSpy.children = [{nodeType: 1, nodeName: 'StaticResource', attributes: [{name: "creativeType", value: "test"}], textContent: 'https://google.com/resource'}]
    const vastCompanion = new VASTCompanion(elementSpy);
    expect(vastCompanion).toBeTruthy();
  });
});
