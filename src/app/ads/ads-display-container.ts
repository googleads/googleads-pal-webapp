/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
