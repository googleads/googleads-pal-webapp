import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanionAdsDirective } from './companion-ads.directive';
import { LinearAdsDirective } from './linear-ads.directive';
import { LinearAdRendererComponent } from './linear-ad-renderer/linear-ad-renderer.component';
import { CompanionAdRendererComponent } from './companion-ad-renderer/companion-ad-renderer.component';



@NgModule({
  declarations: [CompanionAdsDirective, LinearAdsDirective, LinearAdRendererComponent, CompanionAdRendererComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [
    LinearAdRendererComponent,
    CompanionAdRendererComponent
  ],
  exports: [
    LinearAdsDirective,
    CompanionAdsDirective
  ]
})
export class AdsModule { }
