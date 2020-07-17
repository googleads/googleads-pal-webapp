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
