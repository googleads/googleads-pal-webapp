import { ElementRef } from '@angular/core';
import { CompanionAdsDirective } from './companion-ads.directive';
import { LinearAdsDirective } from './linear-ads.directive';

export class AdsDisplayContainer {
    constructor(
        private videoElementInternal: ElementRef,
        private linearAdsHostInternal: LinearAdsDirective,
        private companionAdsHostInternal: CompanionAdsDirective) { }

    get videoElement(): ElementRef {
        return this.videoElementInternal;
    }
    
    get videoWidth(): number {
        return this.videoElementInternal.nativeElement.offsetWidth;
    }

    get videoHeight(): number {
        return this.videoElementInternal.nativeElement.offsetHeight;
    }

    get linearAdsHost(): LinearAdsDirective {
        return this.linearAdsHostInternal;
    }

    get companionAdsHost(): CompanionAdsDirective {
        return this.companionAdsHostInternal;
    }
}
