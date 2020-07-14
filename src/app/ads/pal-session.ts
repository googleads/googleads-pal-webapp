export class PalSession {
    get nonce(): string {
      return this.nonceManager.getNonce();
    }
  
    constructor(private nonceManager: goog.pal.NonceManager) {}
  
    sendImpression(): void {
      this.nonceManager.sendAdImpression();
    }
  
    sendClick(): void {
      this.nonceManager.sendAdClick();
    }
  }
