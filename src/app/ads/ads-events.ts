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