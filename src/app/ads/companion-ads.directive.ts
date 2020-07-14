import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appCompanionAds]'
})
export class CompanionAdsDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
