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

import {VASTAd} from './vast-ad';
import {VASTCompanionAds} from './vast-companion-ads';
import {VASTIcon} from './vast-icon';
import {VASTLinear} from './vast-linear';
import {VASTMediaFile} from './vast-media-file';
import {VASTClickTracking} from './vast-video-clicks';

export class AdsRendering {
  private impressionsInternal: URL[];

  get impressions(): URL[] {
    return [...this.impressionsInternal];
  }

  addImpression(url: URL) {
    this.impressionsInternal.push(url);
  }

  private linearInternal?: VASTLinear;

  get linear(): VASTLinear|undefined {
    return this.linearInternal;
  }

  set linear(val: VASTLinear|undefined) {
    this.linearInternal = val;
  }

  private companionAdsInternal?: VASTCompanionAds;

  get companionAds(): VASTCompanionAds|undefined {
    return this.companionAdsInternal;
  }

  set companionAds(val: VASTCompanionAds|undefined) {
    this.companionAdsInternal = val;
  }

  private mediaFileInternal?: VASTMediaFile;

  get mediaFile(): VASTMediaFile|undefined {
    return this.mediaFileInternal;
  }

  set mediaFile(val: VASTMediaFile|undefined) {
    this.mediaFileInternal = val;
  }

  private adInternal?: VASTAd;

  get ad(): VASTAd|undefined {
    return this.adInternal;
  }

  set ad(val: VASTAd|undefined) {
    this.adInternal = val;
  }

  private linearClickTrackingsInternal: VASTClickTracking[];

  get linearClickTrackings(): VASTClickTracking[] {
    return [...this.linearClickTrackingsInternal];
  }

  addLinearClickTracking(clickTracking: VASTClickTracking) {
    this.linearClickTrackingsInternal.push(clickTracking);
  }

  private parentsInternal: VASTAd[];

  get parents(): VASTAd[] {
    return [...this.parentsInternal];
  }

  set parents(parents: VASTAd[]) {
    this.parentsInternal = [...parents];
  }

  private iconClickTrackedInternal: boolean;

  get iconClickTracked(): boolean {
    return this.iconClickTrackedInternal;
  }

  set iconClickTracked(val: boolean) {
    this.iconClickTrackedInternal = val;
  }

  get icon(): VASTIcon|undefined {
    for (const ad of [this.adInternal, ...this.parentsInternal]) {
      if (ad?.linearCreative) {
        if (ad.linearCreative.icons.length > 0) {
          return ad.linearCreative.icons[0];
        }
      }
    }

    return undefined;
  }

  constructor() {
    this.impressionsInternal = [];
    this.linearClickTrackingsInternal = [];
    this.parentsInternal = [];
    this.iconClickTrackedInternal = false;
  }
}

