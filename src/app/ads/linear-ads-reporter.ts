import { HttpClient, HttpResponse } from '@angular/common/http';
import { assertDefined, assertNumber, assertString } from './common';
import { Subject } from 'rxjs';

import { AdsLinearAdTrackingEvent } from './ads-events';
import { AdsIconViewEvent } from './ads-events';
import { AdsIconClickEvent } from './ads-events';
import { AdsRendering } from './ads-rendering';
import { VASTCreative } from './vast-creative';
import { VASTTracking } from './vast-tracking';
import { LinearAdRendererComponent } from './linear-ad-renderer/linear-ad-renderer.component';
import { VASTAd } from './vast-ad';

export class LinearAdsReporter {
    eventReported: Subject<AdsLinearAdTrackingEvent>;

    iconView: Subject<AdsIconViewEvent>;

    iconClick: Subject<AdsIconClickEvent>;

    private firstQuartileSent: boolean;

    private midpointSent: boolean;

    private thirdQuartileSent: boolean;

    private completeSent: boolean;

    private iconClickSent: boolean;

    private continuousPlayTime: number;

    private lastPosition: number;

    constructor(private http: HttpClient, private renderer: LinearAdRendererComponent) {
        this.firstQuartileSent = false;
        this.midpointSent = false;
        this.thirdQuartileSent = false;
        this.completeSent = false;
        this.iconClickSent = false;
        this.continuousPlayTime = 0;
        this.lastPosition = 0;
        this.eventReported = new Subject<AdsLinearAdTrackingEvent>();
        this.iconView = new Subject<AdsIconViewEvent>();
        this.iconClick = new Subject<AdsIconClickEvent>();
        this.renderer.loadedData.subscribe(
            (event: Event) => this.onLoadedData(event));

        this.renderer.playStart.subscribe(
            (event: Event) => this.onPlayStart(event));

        this.renderer.timeUpdate.subscribe(
            (event: Event) => this.onTimeUpdate(event));

        this.renderer.iconView.subscribe((event: Event) => this.onIconView(event));
        this.renderer.iconClick.subscribe(
            (event: Event) => this.onIconClick(event));
    }

    private onLoadedData(event: Event) { }

    private onPlayStart(event: Event) {
        assertDefined(this.renderer.adsRendering);
        const adsRendering = this.renderer.adsRendering;
        const startEvents = this.filterEvents(adsRendering, 'start');

        for (const trackingEvent of startEvents) {
            this.ping(trackingEvent.uri);
        }

        this.eventReported.next({ events: startEvents, type: 'start' });
    }

    private onIconView(event: Event) {
        assertDefined(this.renderer.icon);
        const icon = this.renderer.icon;

        if (icon.viewTracking) {
            for (const uri of icon.viewTracking) {
                this.ping(uri);
            }

            this.iconView.next({ icon, events: [...icon.viewTracking] });
        } else {
            this.iconView.next({ icon, events: [] });
        }
    }

    private onIconClick(event: Event) {
        assertDefined(this.renderer.icon);
        const icon = this.renderer.icon;

        if (this.iconClickSent === false) {
            if (icon.clicks?.clickTrackings) {
                for (const click of icon.clicks.clickTrackings) {
                    this.ping(click.uri);
                }

                this.iconClickSent = true;
                this.iconClick.next({ icon, events: icon.clicks.clickTrackings });
            } else {
                this.iconClick.next({ icon, events: [] });
            }
        } else {
            this.iconClick.next({ icon, events: [] });
        }
    }

    private onTimeUpdate(event: Event) {
        this.continuousPlayTime =
            this.continuousPlayTime + this.renderer.currentTime - this.lastPosition;

        if (this.firstQuartileSent === false) {
            if (Number(this.continuousPlayTime.toFixed(3)) >=
                Number((this.renderer.duration / 4).toFixed(3))) {
                this.sendEvent('firstQuartile');
                this.firstQuartileSent = true;
            }
        }

        if (this.midpointSent === false) {
            if (Number(this.continuousPlayTime.toFixed(3)) >=
                Number((this.renderer.duration / 3).toFixed(3))) {
                this.sendEvent('midpoint');
                this.midpointSent = true;
            }
        }

        if (this.thirdQuartileSent === false) {
            if (Number(this.continuousPlayTime.toFixed(3)) >=
                Number(((this.renderer.duration / 4) * 3).toFixed(3))) {
                this.sendEvent('thirdQuartile');
                this.thirdQuartileSent = true;
            }
        }

        if (this.completeSent === false) {
            if (Number(this.continuousPlayTime.toFixed(3)) >=
                Number(this.renderer.duration.toFixed(3))) {
                this.sendEvent('complete');
                this.completeSent = true;
            }
        }

        this.lastPosition = this.renderer.currentTime;
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
        assertDefined(adsRendering.linear);
        const creatives: VASTCreative[] = [
            adsRendering.linear,
            ...adsRendering.parents.flatMap((ad: VASTAd) => {
                assertDefined(ad.linearCreative);
                return ad.linearCreative;
            })
        ];

        return creatives.flatMap(
            creative => creative.trackingEvents.filter(e => e.event === type));
    }

    private ping(url: URL) {
        const pixel = new Image();
        pixel.src = url.toString();
    }
}
