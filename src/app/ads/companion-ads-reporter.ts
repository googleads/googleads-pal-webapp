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

import { HttpClient, HttpResponse } from '@angular/common/http';
import { assertDefined, assertNumber, assertString } from './common';
import { Subject } from 'rxjs';

import { AdsLinearAdTrackingEvent } from './ads-events';
import { AdsRendering } from './ads-rendering';
import { CompanionAdRendererComponent } from './companion-ad-renderer/companion-ad-renderer.component';
import { VASTCompanion } from './vast-companion';
import { VASTCompanionAds } from './vast-companion-ads';
import { VASTTracking } from './vast-tracking';
import { VASTAd } from './vast-ad';

export class CompanionAdsReporter {
    eventReported: Subject<AdsLinearAdTrackingEvent>;

    private creativeViewSent: boolean;

    constructor(private http: HttpClient, private renderer: CompanionAdRendererComponent) {
        this.renderer.adClicked.subscribe(
            (event: Event) => this.onAdClicked(event));
        this.renderer.loaded.subscribe((event: Event) => this.onLoaded(event));
        this.eventReported = new Subject<AdsLinearAdTrackingEvent>();
        this.creativeViewSent = false;
    }

    private onAdClicked(event: Event) { }

    private onLoaded(event: Event) {
        if (this.creativeViewSent === false) {
            this.sendEvent('creativeView');
            this.creativeViewSent = true;
        }
    }

    private sendEvent(type: string) {
        assertDefined(this.renderer.adsRendering);
        const adsRendering = this.renderer.adsRendering;
        const filteredEvents = this.filterEvents(adsRendering, type);

        for (const filteredEvent of filteredEvents) {
            this.ping(filteredEvent.uri);
        }

        this.eventReported.next({ events: filteredEvents, type });
    }

    private filterEvents(adsRendering: AdsRendering, type: string):
        VASTTracking[] {
            assertDefined(adsRendering.companionAds);
        const companionAds: VASTCompanionAds[] = [
            adsRendering.companionAds,
            ...adsRendering.parents.filter(ad => ad.companionAds !== undefined)
                .flatMap((ad: VASTAd) => {
                    assertDefined(ad.companionAds);
                    return ad.companionAds;})
        ];

        const staticCompanions: VASTCompanion[] =
            companionAds.flatMap(creative => creative.staticCompanions);

        return staticCompanions.flatMap(companion => companion.trackingEvents)
            .filter(event => event.event === type);
    }

    private ping(url: URL) {
        const pixel = new Image();
        pixel.src = url.toString();
    }
}

