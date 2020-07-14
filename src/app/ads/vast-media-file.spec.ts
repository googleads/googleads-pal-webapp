import { VASTMediaFile } from './vast-media-file';

describe('VASTMediaFile', () => {
  it('should create an instance', () => {
    const elementSpy = {} as any;
    elementSpy.attributes = [{ name: 'delivery', value: 'progressive' }, { name: 'width', value: '640' }, {name: 'type', value: 'test'}, {name: "height", value: '360'}];
    elementSpy.textContent = "https://www.google.com/creative.mp4";
    const mediaFile = new VASTMediaFile(elementSpy);

    expect(mediaFile).toBeTruthy();
  });
});
