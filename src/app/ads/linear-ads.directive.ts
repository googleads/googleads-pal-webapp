import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appLinearAds]'
})
export class LinearAdsDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
