import { Injectable, ComponentFactoryResolver, EventEmitter } from '@angular/core';
import { AdsDisplayContainer } from './ads-display-container';
import { AdsPalSessionEvent } from './ads-events';
import { PalService } from './pal.service';
import { AdsRequest } from './ads-request';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { forkJoin, from, Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, filter, flatMap, map, switchMap, tap } from 'rxjs/operators';
import { AdsManager } from './ads-manager';
import { PalSession } from './pal-session';
import { randomInt } from './common';
import { VASTWrapper } from './vast-wrapper';
import {VASTDocument} from './vast-document';

@Injectable({
  providedIn: 'root'
})
export class AdsLoaderService {
  private adDisplayContainerInternal?: AdsDisplayContainer;

  palSessionLoaded: EventEmitter<AdsPalSessionEvent>;

  get adDisplayContainer(): AdsDisplayContainer | undefined {
    return this.adDisplayContainerInternal;
  }

  set adDisplayContainer(val: AdsDisplayContainer | undefined) {
    this.adDisplayContainerInternal = val;
  }

  constructor(
    private palService: PalService,
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {
    this.palSessionLoaded = new EventEmitter<AdsPalSessionEvent>();
  }

  requestAds(adsRequest: AdsRequest): Observable<AdsManager> {
    if (adsRequest.tagUrl === undefined) {
      return throwError(new Error('Ad tag url is not specified.'));
    }

    if (adsRequest.palRequest !== undefined) {
      if (adsRequest.palRequest.descriptionUrl === undefined) {
        adsRequest.palRequest.descriptionUrl = this.getDescriptionUrl();
      }

      return this.palService.loadNonce(adsRequest.palRequest)
        .pipe(
          tap((session: PalSession) => {
            this.palSessionLoaded.emit({ session });
          }),
          switchMap((session: PalSession) => {
            return this.requestAdsInternal(adsRequest, session);
          }));
    } else {
      return this.requestAdsInternal(adsRequest);
    }
  }

  private getDescriptionUrl(): string {
    return window.location.protocol + '//' + window.location.hostname;
  }

  private requestAdsInternal(adsRequest: AdsRequest, session?: PalSession):
    Observable<AdsManager> {
    if (adsRequest.tagUrl === undefined) {
      return throwError(new Error('Ad tag url is not specified.'));
    } else {
      let adTagUrl;

      try {
        adTagUrl = new URL(adsRequest.tagUrl);
        adTagUrl = this.appendCorrelator(adTagUrl);
        adTagUrl = this.appendUrlParam(adTagUrl);
      } catch (err) {
        console.error(err);
        return throwError(err);
      }

      if (session !== undefined) {
        adTagUrl = this.appendNonce(adTagUrl, session.nonce);
      }

      return this.fetchInternal(adTagUrl, undefined)
        .pipe(
          flatMap(vast => forkJoin([
            of(vast),
            ...vast.ads.filter(ad => ad instanceof VASTWrapper)
              .map(
                ad => this.fetchInternal(
                  (ad as VASTWrapper).vastAdTagURI,
                  (ad as VASTWrapper)))
          ])),
          map(([
            parent,
          ]) =>
            new AdsManager(
              parent, this.componentFactoryResolver,
              this.adDisplayContainer!, this.http, session)));
    }
  }

  private appendCorrelator(adTagUrl: URL): URL {
    let correlator = randomInt(10000, 100000).toString();
    correlator += randomInt(1000, 10000).toString();

    console.debug('Correlator generated. value=' + correlator);
    return this.appendParam(adTagUrl, 'correlator', correlator);
  }

  private appendUrlParam(adTagUrl: URL): URL {
    const url = this.getDescriptionUrl();
    return this.appendParam(adTagUrl, 'url', url);
  }

  private appendParam(url: URL, key: string, val: string): URL {
    if (url.searchParams.has(key)) {
      const oldValues = url.searchParams.getAll(key);

      url.searchParams.delete(key);
      console.debug(
        'Existing param value deleted. ' + key + '=' + oldValues.toString());
    }

    url.searchParams.append(key, val);
    console.debug('New param value appended. ' + key + '=' + val);
    return url;
  }

  private appendNonce(adTagUrl: URL, nonce: string): URL {
    return this.appendParam(adTagUrl, 'paln', nonce);
  }

  private fetchInternal(adTagURI: URL, wrapper?: VASTWrapper):
    Observable<VASTDocument> {
    return this.http
      .get(adTagURI.toString(), { observe: 'response', responseType: 'text' })
      .pipe(
        map((resp: HttpResponse<string>) => {
          if (resp.body == null) {
            throw new Error('Ad tag returned empty body.');
          }

          console.info('Ad response. ', resp.body);
          const doc =
            new DOMParser().parseFromString(resp.body, 'text/xml');

          const vast = new VASTDocument(doc);

          if (wrapper) {
            wrapper.vast = vast;
          }

          return vast;
        }),
        catchError(error => this.handleFetchError(error)));
  }

  private handleFetchError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      return throwError(new Error(`${error.error.message}`));
    } else {
      return throwError(new Error(`${error.message}`));
    }
  }
}
