declare namespace goog {
    namespace pal {
        class NonceLoader {
            loadNonceManager(request: NonceRequest): Promise<NonceManager>;
        }

        class NonceRequest {
            descriptionUrl?: string;

            omidVersion?: string;
        
            omidPartnerVersion?: string;
        
            omidPartnerName?: string;
        
            playerType?: string;
        
            playerVersion?: string;
        
            ppid?: string;
        
            videoHeight?: number;
        
            videoWidth?: number;
        
            adWillAutoPlay?: boolean;
        
            adWillPlayMuted?: boolean;
        
            continuousPlayback?: boolean;
        
            iconsSupported?: boolean;
        }

        class NonceManager {
            getNonce(): string;
            
            sendAdClick(): void;

            sendAdImpression(): void;
        }
    }
}