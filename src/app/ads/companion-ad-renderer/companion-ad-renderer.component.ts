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

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {assertDefined, assertNumber, assertString} from '../common';
import {fromEvent, Subject} from 'rxjs';

import {AdsRendering} from '../ads-rendering';
import {VASTCompanion} from '../vast-companion';

@Component({
  selector: 'app-component-ad-renderer',
  templateUrl: './companion-ad-renderer.component.html',
  styleUrls: ['./companion-ad-renderer.component.css']
})
export class CompanionAdRendererComponent {
  @ViewChild('adElement', {static: false}) private imageElementRef?: ElementRef;

  private imageElement?: HTMLImageElement;

  private hiddenInternal: boolean;

  private widthInternal: number;

  private heightInternal: number;

  @Input() adsRendering?: AdsRendering;

  @Output() adClicked: EventEmitter<Event>;

  @Output() loaded: EventEmitter<Event>;

  get hidden(): boolean {
    return this.hiddenInternal;
  }

  set hidden(val: boolean) {
    this.hiddenInternal = val;
  }

  get width(): number {
    if (this.companion !== undefined) {
      return this.companion.width;
    }

    return 0;
  }

  get height(): number {
    if (this.companion !== undefined) {
      return this.companion.height;
    }

    return 0;
  }

  get companion(): VASTCompanion|undefined {
    if (this.adsRendering !== undefined) {
      if (this.adsRendering.companionAds !== undefined) {
        return this.adsRendering.companionAds.companions[0];
      }
    }

    return undefined;
  }

  get companionUrl(): string|undefined {
    if (this.companion !== undefined) {
      return this.companion.staticResource.uri.toString();
    }

    return undefined;
  }

  constructor() {
    this.hiddenInternal = true;
    this.widthInternal = 0;
    this.heightInternal = 0;
    this.adClicked = new EventEmitter<Event>();
    this.loaded = new EventEmitter<Event>();
  }

  ngAfterViewInit() {
    if (this.imageElementRef?.nativeElement) {
      this.imageElement =
          this.imageElementRef.nativeElement as HTMLImageElement;

      fromEvent(this.imageElement, 'load').subscribe(e => this.onLoad(e));
    }
  }

  hasClickThrough(): boolean {
    assertDefined(this.adsRendering?.companionAds);
    const companionAds = this.adsRendering?.companionAds

    if (companionAds.staticCompanions.length) {
      const staticCompanion = companionAds.staticCompanions[0];
      return staticCompanion.companionClickThrough !== undefined;
    } else {
      return false;
    }
  }

  onClick(event: Event): void {
    console.debug('Companion ad clicked.', event);
    this.adClicked.emit(event);
  }

  onLoad(event: Event): void {
    console.debug('Companion ad loaded.', event);
    this.loaded.emit(event);
  }
}

