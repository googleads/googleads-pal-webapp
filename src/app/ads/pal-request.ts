export interface PalRequest {
    descriptionUrl?: string;

    omidVersion?: string;

    omidPartnerVersion?: string;

    omidPartnerName?: string;

    playerType?: string;

    playerVersion?: string;

    ppid?: string;

    videoHeight?: number;

    videoWidth?: number;

    willAutoPlay?: boolean;

    willPlayMuted?: boolean;

    continuousPlayback?: boolean;

    iconsSupported?: boolean;
}
