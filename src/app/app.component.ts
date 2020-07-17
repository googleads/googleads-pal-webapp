import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {AdsDisplayContainer} from './ads/ads-display-container';
import {AdsContentPauseRequestedEvent} from './ads/ads-events';
import {AdsScheduledEvent} from './ads/ads-events';
import {AdsPlayedEvent} from './ads/ads-events';
import {AdsPalSessionEvent} from './ads/ads-events';
import {AdsErrorEvent} from './ads/ads-events';
import {AdsLinearAdClickedEvent} from './ads/ads-events';
import {AdsLinearAdTrackingEvent} from './ads/ads-events';
import {AdsLinearAdImpressionEvent} from './ads/ads-events';
import {AdsCompanionAdClickedEvent} from './ads/ads-events';
import {AdsIconViewEvent} from './ads/ads-events';
import {AdsIconClickEvent} from './ads/ads-events';
import {AdsLoaderService} from './ads/ads-loader.service';
import {AdsManager} from './ads/ads-manager';
import {AdsRequest} from './ads/ads-request';
import {CompanionAdsDirective} from './ads/companion-ads.directive';
import {LinearAdsDirective} from './ads/linear-ads.directive';
import {PlayerComponent} from './player/player/player.component';

import {LogMessage} from './console/log-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('playerCard', {static: false})
  private playerCardInternal!: PlayerComponent;

  @ViewChild(CompanionAdsDirective, {static: true})
  private companionAdsHost!: CompanionAdsDirective;

  @ViewChild(LinearAdsDirective, {static: true})
  private linearAdsHost!: LinearAdsDirective;

  title = 'PAL Web App';

  tagForm: FormGroup;

  logs: LogMessage[];

  constructor(private adsLoader: AdsLoaderService, private titleService: Title) {
    this.tagForm = new FormGroup({
      'tagUrl': new FormControl(
          'https://pubads.g.doubleclick.net/gampad/ads?iu=/6075/pal_taskforce/pg&description_url=http%3A%2F%2Fkorgpalwebdev1.googleplex.com&url=http%3A%2F%2Fkorgpalwebdev1.googleplex.com&tfcd=0&npa=0&sz=640x480&ciu_szs=300x250&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=12345&nofb=1&ad_rule=0&wta=1'),
      'video': new FormControl(
          'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'),
      'palEnabled': new FormControl(true),
      'pal': new FormGroup({
        'descriptionUrl': new FormControl(this.getDescriptionUrl()),
        'omidVersion': new FormControl(),
        'omidPartnerVersion': new FormControl(),
        'omidPartnerName': new FormControl(),
        'playerType': new FormControl(),
        'playerVersion': new FormControl(),
        'ppid': new FormControl('12JD92JD8078S8J29SDOAKC0EF230337'),
        'videoHeight': new FormControl(480),
        'videoWidth': new FormControl(640),
        'willAutoPlay': new FormControl(false),
        'willPlayMuted': new FormControl(false),
        'continuousPlayback': new FormControl(false),
        'iconsSupported': new FormControl(true),
      })
    });

    this.tagForm.valueChanges.subscribe(
        event => this.onFormValueChanged(event));

    if (window.location.protocol !== 'https:') {
      this.tagForm.controls['palEnabled'].setValue(false);
    }

    this.logs = [];
    this.titleService.setTitle(this.title);
  }

  ngAfterViewInit() {
    this.adsLoader.adDisplayContainer = new AdsDisplayContainer(
        this.playerCardInternal.videoElement, this.linearAdsHost,
        this.companionAdsHost);

    this.adsLoader.palSessionLoaded.subscribe(
        this.onPalSessionLoaded.bind(this));
  }

  onLoad() {
    this.logs = [];
    const formValue = this.tagForm.value;
    this.playerCardInternal.load(formValue['video']);

    const adsRequest: AdsRequest = {
      tagUrl: formValue['tagUrl'],
    };

    if ('pal' in formValue) {
      adsRequest.palRequest = {
        descriptionUrl: formValue['pal']['descriptionUrl'],
        omidVersion: formValue['pal']['omidVersion'],
        omidPartnerVersion: formValue['pal']['omidPartnerVersion'],
        omidPartnerName: formValue['pal']['omidPartnerName'],
        playerType: formValue['pal']['playerType'],
        playerVersion: formValue['pal']['playerVersion'],
        ppid: formValue['pal']['ppid'],
        videoHeight: formValue['pal']['videoHeight'],
        videoWidth: formValue['pal']['videoWidth'],
        willAutoPlay: formValue['pal']['willAutoPlay'],
        willPlayMuted: formValue['pal']['willPlayMuted'],
        continuousPlayback: formValue['pal']['continuousPlayback'],
        iconsSupported: formValue['pal']['iconsSupported'],
      };
    }

    // adsRequest.tagUrl =
    //     'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=';

    if (this.adsLoader !== undefined) {
      this.adsLoader.requestAds(adsRequest)
          .subscribe(
              (adsManager: AdsManager) => {
                adsManager.contentPauseRequested.subscribe(
                    this.onContentPauseRequested.bind(this));

                adsManager.contentResumeRequested.subscribe(
                    this.onContentResumeRequested.bind(this));

                adsManager.adScheduled.subscribe(
                    this.onAdsScheduled.bind(this));
                adsManager.adPlayed.subscribe(this.onAdsPlayed.bind(this));
                adsManager.adErrored.subscribe(this.onAdsErrored.bind(this));
                adsManager.linearAdClicked.subscribe(
                    (event: AdsLinearAdClickedEvent) =>
                        this.onLinearAdClicked(event));
                adsManager.linearAdEventReported.subscribe(
                    event => this.onLinearAdEventReported(event));
                adsManager.linearAdImpression.subscribe(
                    event => this.onLinearAdImpression(event));
                adsManager.companionAdClicked.subscribe(
                    event => this.onCompanionAdClicked(event));
                adsManager.iconView.subscribe(event => this.onIconView(event));
                adsManager.iconClick.subscribe(
                    event => this.onIconClick(event));
                adsManager.start();
              },
              (e: any) => {
                this.handleAdsRequestError(e);
              });
    }
  }

  private onContentPauseRequested(event: AdsContentPauseRequestedEvent) {
    this.playerCardInternal.pause();
  }

  private onContentResumeRequested(event: AdsContentPauseRequestedEvent) {
    this.logs.push({message: 'Ad playback finished.'});
    this.playerCardInternal.play();
  }

  onManifestLoaded(event: string) {
    this.logs.push({
      message: 'Content manifest loaded.',
    });
  }

  onPalSessionLoaded(event: AdsPalSessionEvent) {
    this.logs.push({
      message: `PAL nonce loaded. nonce=${event.session.nonce}`,
    });
  }

  private onAdsScheduled(event: AdsScheduledEvent) {
    const adSystem = event.ad.adSystem ? event.ad.adSystem : '';
    const adId = event.ad.id ? event.ad.id : '';
    this.logs.push(
        {message: 'Ad scheduled. ad_system=' + adSystem + ', ad_id=' + adId});
  }

  private onAdsPlayed(event: AdsPlayedEvent) {
    this.logs.push({message: 'Ad playback started.'});
  }

  private onAdsErrored(event: AdsErrorEvent) {
    this.logs.push({message: 'Ad error. message="' + event.message + '"'});
  }

  private onLinearAdClicked(event: AdsLinearAdClickedEvent) {
    this.logs.push({message: 'Linear ad clicked.'});
  }

  private onCompanionAdClicked(event: AdsCompanionAdClickedEvent) {
    this.logs.push({message: 'Companion ad clicked.'});
  }

  private onLinearAdEventReported(event: AdsLinearAdTrackingEvent) {
    this.logs.push({
      message: 'VAST event reported. type=' + event.type +
          ', count=' + event.events.length
    });
  }

  private onLinearAdImpression(event: AdsLinearAdImpressionEvent) {
    this.logs.push({
      message: 'VAST impression reported. count=' + event.impressions.length
    });
  }

  private onFormValueChanged(event: any) {
    console.debug(
        'Form enabled: ' + this.tagForm.controls['pal'].enabled +
            ', Pal enabled: ' + event['palEnabled'],
        event);
    if (this.tagForm.controls['pal'].enabled === true &&
        event['palEnabled'] === false) {
      this.tagForm.controls['pal'].disable();
    } else if (
        this.tagForm.controls['pal'].disabled === true &&
        event['palEnabled'] === true) {
      this.tagForm.controls['pal'].enable();
    }
  }

  private getDescriptionUrl(): string {
    return window.location.protocol + '//' + window.location.hostname;
  }

  onDescriptionButtonClick(event: Event) {
    window.open('https://www.google.com');
  }

  onHelpButtonClick(event: Event) {
    window.open('https://www.google.com');
  }

  onInfoButtonClick(event: Event) {
    window.open('https://www.google.com');
  }

  onVersionButtonClick(event: Event) {
    window.open('https://www.google.com');
  }

  private onIconView(event: AdsIconViewEvent) {
    this.logs.push({
      message: `Icon viewed. program=${event.icon.program}, events=${
          event.events.length}`
    });
  }

  private onIconClick(event: AdsIconClickEvent) {
    this.logs.push({message: `Icon clicked. events=${event.events.length}`});
  }

  private handleAdsRequestError(e: Error) {
    this.logs.push(
        {message: 'There was a problem requesting ads from the server.'});
  }
}
