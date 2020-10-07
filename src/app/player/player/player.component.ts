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

import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {from, fromEvent} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('contentElement', {static: false})
  private videoElementInternal!: ElementRef;

  @Output() manifestLoaded: EventEmitter<string>;

  get videoElement(): ElementRef {
    return this.videoElementInternal;
  }

  private player!: shaka.Player;

  constructor() {
    this.manifestLoaded = new EventEmitter<string>();
  }

  ngAfterViewInit() {
    this.player = new shaka.Player(this.videoElementInternal.nativeElement);

    const nativeElement =
        this.videoElementInternal.nativeElement as HTMLVideoElement;

    fromEvent(nativeElement, 'loadeddata')
        .subscribe(this.onLoadedData.bind(this));
    fromEvent(nativeElement, 'ended').subscribe(this.onEnded.bind(this));
  }

  load(videoUrl: string) {
    this.player.load(videoUrl).then(() => {
      console.debug('Shaka loaded.');
      this.manifestLoaded.emit(videoUrl);
    });
  }

  pause() {
    this.videoElementInternal.nativeElement.pause();
  }

  play() {
    this.videoElementInternal.nativeElement.play();
  }

  private onLoadedData(event: Event) {
    console.debug('Loaded data.', event);
  }

  private onEnded(event: Event) {
    console.debug('Ended.', event);
  }
}
