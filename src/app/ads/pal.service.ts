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

import { Injectable } from '@angular/core';
import { PalRequest } from './pal-request';
import {from, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {PalSession} from './pal-session';

@Injectable({
  providedIn: 'root'
})
export class PalService {
  private nonceLoader: goog.pal.NonceLoader;

  private nonceManager?: goog.pal.NonceManager;

  constructor() {
    this.nonceLoader = new goog.pal.NonceLoader();
  }

  get nonce(): string|undefined {
    return this.nonceManager?.getNonce();
  }

  loadNonce(request: PalRequest): Observable<PalSession> {
    const nonceRequest = new goog.pal.NonceRequest();

    if (request.willAutoPlay !== undefined && request.willAutoPlay !== null) {
      nonceRequest.adWillAutoPlay = request.willAutoPlay;
    }

    if (request.continuousPlayback !== undefined &&
        request.continuousPlayback !== null) {
      nonceRequest.continuousPlayback = request.continuousPlayback;
    }

    if (request.willPlayMuted !== undefined && request.willPlayMuted !== null) {
      nonceRequest.adWillPlayMuted = request.willPlayMuted;
    }

    if (request.descriptionUrl !== undefined &&
        request.descriptionUrl !== null) {
      nonceRequest.descriptionUrl = request.descriptionUrl;
    }

    if (request.iconsSupported !== undefined &&
        request.iconsSupported !== null) {
      nonceRequest.iconsSupported = request.iconsSupported;
    }

    if (request.playerType !== undefined && request.playerType !== null) {
      nonceRequest.playerType = request.playerType;
    }

    if (request.playerVersion !== undefined && request.playerVersion !== null) {
      nonceRequest.playerVersion = request.playerVersion;
    }

    if (request.omidPartnerName !== undefined &&
        request.omidPartnerName !== null) {
      nonceRequest.omidPartnerName = request.omidPartnerName;
    }

    if (request.omidPartnerVersion !== undefined &&
        request.omidPartnerVersion !== null) {
      nonceRequest.omidPartnerVersion = request.omidPartnerVersion;
    }

    if (request.omidVersion !== undefined && request.omidVersion !== null) {
      nonceRequest.omidVersion = request.omidVersion;
    }

    if (request.ppid !== undefined && request.ppid !== null) {
      nonceRequest.ppid = request.ppid;
    }

    if (request.videoHeight !== undefined && request.videoHeight !== null) {
      nonceRequest.videoHeight = request.videoHeight;
    }

    if (request.videoWidth !== undefined && request.videoWidth !== null) {
      nonceRequest.videoWidth = request.videoWidth;
    }

    const nonceManager$ = from(this.nonceLoader.loadNonceManager(nonceRequest));
    nonceManager$.subscribe(
        (manager: goog.pal.NonceManager) => {
          this.nonceManager = manager;

          if (this.nonceManager) {
            console.info('New nonce value ', this.nonceManager.getNonce());
          }
        },
        (error: Error) => {
          console.error('Failed to refresh nonce. ' + error);
        });

    return nonceManager$.pipe(
        map((manager: goog.pal.NonceManager) => new PalSession(manager)));
  }
}
