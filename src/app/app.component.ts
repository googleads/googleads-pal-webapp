import { Component } from '@angular/core';
import {AdsLoaderService} from './ads/ads-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'palwebapp';

  constructor(private adsLoader: AdsLoaderService) {}
}
