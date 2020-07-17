import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AdsModule } from './ads/ads.module';
import { ConsoleComponent } from './console/console.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PlayerModule} from './player/player.module';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent
  ],
  imports: [
    BrowserAnimationsModule,
    PlayerModule,
    MatToolbarModule,
    MatGridListModule, 
    MatInputModule, 
    MatListModule, 
    MatCardModule,
    MatButtonModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    AdsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
