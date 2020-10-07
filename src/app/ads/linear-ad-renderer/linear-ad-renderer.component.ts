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

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { assertNumber, assertString, assertDefined } from '../common';
import { fromEvent, Subject } from 'rxjs';

import { AdsRendering } from '../ads-rendering';
import { VASTDelivery } from '../vast-delivery.enum';
import { VASTIcon } from '../vast-icon';
import { VASTLinear } from '../vast-linear';
import { VASTMediaFile } from '../vast-media-file';

@Component({
  selector: 'app-linear-ad-renderer',
  templateUrl: './linear-ad-renderer.component.html',
  styleUrls: ['./linear-ad-renderer.component.css']
})
export class LinearAdRendererComponent implements AfterViewInit {
  @ViewChild('adElement', { static: false })
  videoElementInternal!: ElementRef;

  private videoElement!: HTMLVideoElement;

  @ViewChild('iconElement', { static: false })
  private iconElementRef?: ElementRef;

  private iconElement?: HTMLImageElement;

  private hiddenInternal: boolean;

  private widthInternal: number;

  private heightInternal: number;

  @Output() loadedData: EventEmitter<Event>;

  @Output() ended: EventEmitter<Event>;

  @Output() playStart: EventEmitter<Event>;

  @Output() canPlay: EventEmitter<Event>;

  @Output() adClicked: EventEmitter<Event>;

  @Output() canPlayThrough: EventEmitter<Event>;

  @Output() timeUpdate: EventEmitter<Event>;

  @Output() iconView: EventEmitter<Event>;

  @Output() iconClick: EventEmitter<Event>;

  @Input() adsRendering?: AdsRendering;

  get hidden(): boolean {
    return this.hiddenInternal;
  }

  set hidden(val: boolean) {
    this.hiddenInternal = val;
  }

  get width(): number {
    return this.widthInternal;
  }

  set width(val: number) {
    console.debug('Set ad player width ', val);
    this.widthInternal = val;
  }

  get height(): number {
    return this.heightInternal;
  }

  set height(val: number) {
    console.debug('Set ad player height ', val);
    this.heightInternal = val;
  }

  get linear(): VASTLinear | undefined {
    return this.adsRendering?.linear;
  }

  get mediaFile(): VASTMediaFile | undefined {
    const mp4s = this.linear?.mediaFiles.filter(
      mf => mf.delivery === VASTDelivery.PROGRESSIVE &&
        mf.type === 'video/mp4');

    if (mp4s !== undefined && mp4s.length > 0) {
      return mp4s[0];
    }

    return undefined;
  }

  get duration(): number {
    return this.videoElement.duration;
  }

  get currentTime(): number {
    return this.videoElement.currentTime;
  }

  get icon(): VASTIcon | undefined {
    return this.adsRendering?.icon;
  }

  constructor() {
    this.hiddenInternal = true;
    this.widthInternal = 0;
    this.heightInternal = 0;
    this.loadedData = new EventEmitter<Event>();
    this.ended = new EventEmitter<Event>();
    this.playStart = new EventEmitter<Event>();
    this.canPlay = new EventEmitter<Event>();
    this.adClicked = new EventEmitter<Event>();
    this.canPlayThrough = new EventEmitter<Event>();
    this.timeUpdate = new EventEmitter<Event>();
    this.iconView = new EventEmitter<Event>();
    this.iconClick = new EventEmitter<Event>();
  }

  ngAfterViewInit() {
    this.videoElement =
      this.videoElementInternal.nativeElement as HTMLVideoElement;

    if (this.iconElementRef) {
      this.iconElement = this.iconElementRef.nativeElement;
      assertDefined(this.iconElement);
      fromEvent(this.iconElement, 'load')
        .subscribe(e => this.onIconView(e));
    }

    fromEvent(this.videoElement, 'loadeddata')
      .subscribe(e => this.onLoadedData(e));
    fromEvent(this.videoElement, 'ended').subscribe(e => this.onEnded(e));
    fromEvent(this.videoElement, 'play').subscribe(e => this.onPlay(e));
    fromEvent(this.videoElement, 'canplay').subscribe(e => this.onCanPlay(e));
    fromEvent(this.videoElement, 'canplaythrough')
      .subscribe(e => this.onCanPlayThrough(e));
    fromEvent(this.videoElement, 'timeupdate')
      .subscribe(e => this.onTimeUpdate(e));
  }

  load(uri: URL) {
    this.videoElement.src = uri.toString();
  }

  play() {
    this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }

  private onLoadedData(event: Event): void {
    console.log('Loaded data.', event);
    this.loadedData.emit(event);
  }

  private onEnded(event: Event): void {
    console.log('Ended.', event);
    this.ended.emit(event);
  }

  private onPlay(event: Event): void {
    this.playStart.emit(event);
  }

  private onCanPlay(event: Event): void {
    this.canPlay.emit(event);
  }

  private onCanPlayThrough(event: Event): void {
    this.canPlayThrough.emit(event);
  }

  private onTimeUpdate(event: Event): void {
    this.timeUpdate.emit(event);
  }

  onClick(event: Event): void {
    this.adClicked.emit(event);
  }

  hasClickThrough(): boolean {
    return this.adsRendering?.linear?.videoClicks?.clickThrough !== undefined;
  }

  onIconClick(event: Event): void {
    this.iconClick.emit(event);
  }

  onIconView(event: Event): void {
    this.iconView.emit(event);
  }
}