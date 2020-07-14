import { PalSession } from './pal-session';
import { VASTAd } from './vast-ad';
import { VASTIcon, VASTIconClicks, VASTIconClickTracking } from './vast-icon';
import { VASTTracking } from './vast-tracking';

export interface AdsEvent { }

export interface AdsPalSessionEvent extends AdsEvent {
  session: PalSession;
}

export interface AdsIconClickEvent extends AdsEvent {
  icon: VASTIcon;

  events: VASTIconClickTracking[];
}

export interface AdsIconViewEvent extends AdsEvent {
  icon: VASTIcon;
  events: URL[];
}

export interface AdsLinearAdTrackingEvent extends AdsEvent {
  events: VASTTracking[];

  type: string;
}

export interface AdsCompanionAdClickedEvent extends AdsEvent { }

export interface AdsLinearAdImpressionEvent extends AdsEvent {
  impressions: URL[];
}

export class AdsLinearAdClickedEvent implements AdsEvent { }

export interface AdsLinearAdTrackingEvent extends AdsEvent {
  events: VASTTracking[];

  type: string;
}

export class AdsErrorEvent implements AdsEvent {
  get message(): string {
    return this.messageInternal;
  }

  constructor(private messageInternal: string) { }
}

export class AdsPlayedEvent implements AdsEvent { }

export class AdsScheduledEvent implements AdsEvent {
  get ad(): VASTAd {
    return this.adInternal;
  }

  constructor(private adInternal: VASTAd) { }
}

export class AdsContentPauseRequestedEvent implements AdsEvent { }

export class AdsContentResumeRequestedEvent implements AdsEvent { }