import { PalSession } from './pal-session';


describe('PalSession', () => {
  it('should create an instance', () => {
    const nonceManagerSpy = jasmine.createSpyObj('goog.pal.NonceManager', ['getNonce']);
    const palSession = new PalSession(nonceManagerSpy);
    expect(palSession).toBeTruthy();
  });
});
