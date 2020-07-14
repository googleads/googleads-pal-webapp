import { VASTDocument } from './vast-document';

describe('VASTDocument', () => {
  it('should create an instance', () => {
    const docSpy = jasmine.createSpyObj('XMLDocument', ['documentElement']);
    expect(new VASTDocument(docSpy)).toBeTruthy();
  });
});
