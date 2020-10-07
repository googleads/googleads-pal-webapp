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

import {HttpClient, HttpResponse} from '@angular/common/http';
import {ComponentFactoryResolver, ComponentRef, EventEmitter} from '@angular/core';
import {assertDefined, assertNumber, assertString} from './common';
import {forkJoin, Subject} from 'rxjs';

import {AdsDisplayContainer} from './ads-display-container';
import {AdsEvent} from './ads-events';
import {AdsContentPauseRequestedEvent} from './ads-events';
import {AdsContentResumeRequestedEvent} from './ads-events';
import {AdsScheduledEvent} from './ads-events';
import {AdsPlayedEvent} from './ads-events';
import {AdsErrorEvent} from './ads-events';
import {AdsLinearAdClickedEvent} from './ads-events';
import {AdsLinearAdTrackingEvent} from './ads-events';
import {AdsLinearAdImpressionEvent} from './ads-events';
import {AdsCompanionAdClickedEvent} from './ads-events';
import {AdsIconViewEvent} from './ads-events';
import {AdsIconClickEvent} from './ads-events';
import {AdsRendering} from './ads-rendering';
import {CompanionAdRendererComponent} from './companion-ad-renderer/companion-ad-renderer.component';
import {CompanionAdsReporter} from './companion-ads-reporter';
import {LinearAdsReporter} from './linear-ads-reporter';
import {PalSession} from './pal-session';
import {VASTAd} from './vast-ad';
import {VASTCreative} from './vast-creative';
import {VASTDelivery} from './vast-delivery.enum';
import {VASTDocument} from './vast-document';
import {VASTInLine} from './vast-in-line';
import {VASTLinear} from './vast-linear';
import {VASTMediaFile} from './vast-media-file';
import {VASTWrapper} from './vast-wrapper';
import {LinearAdRendererComponent} from './linear-ad-renderer/linear-ad-renderer.component';

export class AdsManager {
  contentPauseRequested: EventEmitter<AdsContentPauseRequestedEvent>;

  contentResumeRequested: EventEmitter<AdsContentResumeRequestedEvent>;

  adPlayed: EventEmitter<AdsPlayedEvent>;

  adScheduled: EventEmitter<AdsScheduledEvent>;

  adErrored: EventEmitter<AdsErrorEvent>;

  linearAdClicked: EventEmitter<AdsLinearAdClickedEvent>;

  linearAdEventReported: Subject<AdsLinearAdTrackingEvent>;

  linearAdImpression: Subject<AdsLinearAdImpressionEvent>;

  companionAdClicked: Subject<AdsCompanionAdClickedEvent>;

  iconView: Subject<AdsIconViewEvent>;

  iconClick: Subject<AdsIconClickEvent>;

  private renderedAds: AdsRendering[];

  private linearAdsRendererRef?: ComponentRef<LinearAdRendererComponent>;

  private companionAdsRendererRef?: ComponentRef<CompanionAdRendererComponent>;

  private linearAdReporter?: LinearAdsReporter;

  private companionAdReporter?: CompanionAdsReporter;

  constructor(
      private vastDocument: VASTDocument,
      private componentFactoryResolver: ComponentFactoryResolver,
      private adDisplayContainer: AdsDisplayContainer, private http: HttpClient,
      private palSession?: PalSession) {
    this.contentPauseRequested =
        new EventEmitter<AdsContentPauseRequestedEvent>();

    this.contentResumeRequested =
        new EventEmitter<AdsContentResumeRequestedEvent>();

    this.adScheduled = new EventEmitter<AdsScheduledEvent>();
    this.adPlayed = new EventEmitter<AdsPlayedEvent>();
    this.adErrored = new EventEmitter<AdsErrorEvent>();
    this.linearAdClicked = new EventEmitter<AdsLinearAdClickedEvent>();
    this.linearAdEventReported = new Subject<AdsLinearAdTrackingEvent>();
    this.linearAdImpression = new Subject<AdsLinearAdImpressionEvent>();
    this.companionAdClicked = new Subject<AdsCompanionAdClickedEvent>();
    this.iconView = new Subject<AdsIconViewEvent>();
    this.iconClick = new Subject<AdsIconClickEvent>();
    this.renderedAds = [];
  }

  start(): void {
    this.adDisplayContainer.linearAdsHost.viewContainerRef.clear();

    this.linearAdsRendererRef = this.loadLinearAdsRenderer();
    this.companionAdsRendererRef = this.loadCompanionAdsRenderer();

    this.linearAdsRendererRef.instance.width =
        this.adDisplayContainer.videoWidth;
    this.linearAdsRendererRef.instance.height =
        this.adDisplayContainer.videoHeight;

    this.subscribeToLinearAdsEvents(this.linearAdsRendererRef.instance);
    this.subscribeToCompanionAdsEvents(this.companionAdsRendererRef.instance);
    assertDefined(this.linearAdsRendererRef.instance)

    this.linearAdReporter = new LinearAdsReporter(
        this.http, this.linearAdsRendererRef.instance);

    this.linearAdReporter.eventReported.subscribe(
        event => this.onLinearAdEventReported(event));

    this.linearAdReporter.iconClick.subscribe(event => this.onIconClick(event));
    this.linearAdReporter.iconView.subscribe(event => this.onIconView(event));

    assertDefined(this.companionAdsRendererRef.instance);
    this.companionAdReporter = new CompanionAdsReporter(
        this.http, this.companionAdsRendererRef.instance);

    this.companionAdReporter.eventReported.subscribe(
        event => this.onLinearAdEventReported(event));

    const chosen = this.chooseAds();

    if (chosen !== undefined) {
      this.renderAds(chosen);
    } else {
      console.warn('No MediaFile uri to play');
      this.adErrored.emit(new AdsErrorEvent('No ad to play.'));
    }
  }

  private renderAds(adsRendering: AdsRendering) {
    const linearAdsRenderer = this.linearAdsRendererRef!.instance;
    const companionAdsRenderer = this.companionAdsRendererRef!.instance;
    this.adScheduled.emit(new AdsScheduledEvent(adsRendering.ad!));
    linearAdsRenderer.adsRendering = adsRendering;
    companionAdsRenderer.adsRendering = adsRendering;
  }

  private chooseAds(): AdsRendering|undefined {
    const visitedNodes: VASTAd[] = [];
    const parents = new Map<VASTAd, VASTAd>();
    let nodesToProcess: VASTAd[] = [...this.vastDocument.ads];
    let current: AdsRendering|undefined = undefined;

    while (nodesToProcess.length) {
      const node = nodesToProcess.shift();

      if (node === undefined) {
        break;
      }

      if (!(visitedNodes.indexOf(node) > -1)) {
        visitedNodes.push(node);

        if (node instanceof VASTWrapper) {
          const wrapper = node as VASTWrapper;

          if (wrapper.vast) {
            nodesToProcess = wrapper.vast.ads.concat(nodesToProcess);
            wrapper.vast.ads.forEach(ad => parents.set(ad, wrapper));
          }
        } else {
          const inline = node as VASTInLine;

          if (inline.linearCreative) {
            current = new AdsRendering();
            current.ad = node;
            current.linear = inline.linearCreative;
            current.parents = this.getParents(node, parents);

            for (const imp of node.impressions) {
              current.addImpression(imp);
            }

            for (const parent of this.getParents(node, parents)) {
              const currentChecked = current!;

              parent.impressions.forEach(
                  imp => currentChecked.addImpression(imp));
            }

            if (node.linearCreative?.videoClicks?.clickTrackings) {
              const clickTrackings =
                  node.linearCreative?.videoClicks?.clickTrackings;

              for (const clickTracking of clickTrackings) {
                const currentChecked = current!;
                currentChecked.addLinearClickTracking(clickTracking);
              }
            }

            for (const parent of this.getParents(node, parents)) {
              const currentChecked = current!;

              parent.linearCreative?.videoClicks?.clickTrackings.forEach(
                  clickTracking =>
                      currentChecked.addLinearClickTracking(clickTracking));
            }

            current.companionAds = inline.companionAds;
          }
        }
      }
    }

    return current;
  }

  private getParents(ad: VASTAd, parents: Map<VASTAd, VASTAd>): VASTAd[] {
    if (parents.has(ad)) {
      const parent = parents.get(ad)!;
      return [parent, ...this.getParents(parent, parents)];
    } else {
      return [];
    }
  }

  private onLoadedData(event: Event): void {}

  private onCanPlay(event: Event): void {
    this.contentPauseRequested.emit(new AdsContentPauseRequestedEvent());
    const linearAdsRendererChecked = this.linearAdsRendererRef!.instance;

    if (this.companionAdsRendererRef !== undefined) {
      this.companionAdsRendererRef.instance.hidden = false;
    }

    linearAdsRendererChecked.hidden = false;
    linearAdsRendererChecked.play();
  }

  private onEnded(event: Event): void {
    const linearAdsRendererChecked = this.linearAdsRendererRef!.instance;
    const companionAdsRendererChecked = this.companionAdsRendererRef!.instance;

    linearAdsRendererChecked.hidden = true;
    companionAdsRendererChecked.hidden = true;
    this.contentResumeRequested.emit(new AdsContentResumeRequestedEvent());
  }

  private onPlayStart(event: Event): void {
    const linearAdsRendererChecked = this.linearAdsRendererRef!.instance;
    const adsRendering = linearAdsRendererChecked.adsRendering!;

    this.adPlayed.emit(new AdsPlayedEvent());
    adsRendering.impressions.forEach(imp => this.pingUrl(imp));

    if (this.palSession !== undefined) {
      this.palSession.sendImpression();
    }

    this.linearAdImpression.next({impressions: adsRendering.impressions});
  }

  private loadLinearAdsRenderer(): ComponentRef<LinearAdRendererComponent> {
    const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(LinearAdRendererComponent);
    this.adDisplayContainer.linearAdsHost.viewContainerRef.clear();
    return this.adDisplayContainer.linearAdsHost.viewContainerRef
        .createComponent(componentFactory);
  }

  private loadCompanionAdsRenderer(): ComponentRef<CompanionAdRendererComponent> {
    const componentFactory =
        this.componentFactoryResolver.resolveComponentFactory(
            CompanionAdRendererComponent);
    this.adDisplayContainer.companionAdsHost.viewContainerRef.clear();
    return this.adDisplayContainer.companionAdsHost.viewContainerRef
        .createComponent(componentFactory);
  }

  private subscribeToLinearAdsEvents(renderer: LinearAdRendererComponent) {
    renderer.loadedData.subscribe(this.onLoadedData.bind(this));
    renderer.canPlay.subscribe((e: Event) => this.onCanPlay(e));
    renderer.ended.subscribe(this.onEnded.bind(this));
    renderer.playStart.subscribe(this.onPlayStart.bind(this));
    renderer.adClicked.subscribe(
        (event: Event) => this.onLinearAdClicked(event));
  }

  private subscribeToCompanionAdsEvents(renderer: CompanionAdRendererComponent) {
    renderer.adClicked.subscribe(
        (event: Event) => this.onCompanionAdClicked(event));
  }

  private onLinearAdClicked(event: Event) {
    const linearAdsRendererChecked = this.linearAdsRendererRef!.instance;
    const clickThrough = linearAdsRendererChecked.adsRendering!.linear!
                             .videoClicks!.clickThrough!;
    console.log(
        'Linear ad clicked. ' +
        'id=' + clickThrough.id);
    this.linearAdClicked.emit(new AdsLinearAdClickedEvent());
    window.open(clickThrough.uri);
    // linearAdsRendererChecked.pause();

    linearAdsRendererChecked.adsRendering?.linearClickTrackings.forEach(
        clickTracking => this.pingUrl(new URL(clickTracking.uri)));

    if (this.palSession !== undefined) {
      this.palSession.sendClick();
    }
  }

  private onCompanionAdClicked(event: Event) {
    assertDefined(this.companionAdsRendererRef?.instance);
    const companionAdsRenderer = this.companionAdsRendererRef?.instance;

    assertDefined(companionAdsRenderer.adsRendering?.companionAds);
    const companionAds = companionAdsRenderer.adsRendering?.companionAds;

    if (companionAds.staticCompanions.length) {
      const companion = companionAds.staticCompanions[0];

      console.debug(
          'Companion ad clicked. ' +
          'id=' + companion.id);

      if (companion.companionClickThrough) {
        window.open(companion.companionClickThrough.toString());
        this.companionAdClicked.next(new AdsLinearAdClickedEvent());
      }
    }
  }

  private pingUrl(url: URL) {
    const pixel = new Image();
    pixel.src = url.toString();
  }

  private onLinearAdEventReported(event: AdsLinearAdTrackingEvent) {
    this.linearAdEventReported.next(event);
  }

  private onIconView(event: AdsIconViewEvent) {
    this.iconView.next(event);
  }

  private onIconClick(event: AdsIconClickEvent) {
    if (event.icon.clicks?.clickThrough) {
        window.open(event.icon.clicks.clickThrough.toString());
    }

    this.iconClick.next(event);
  }
}
