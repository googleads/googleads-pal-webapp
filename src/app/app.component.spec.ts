import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AdsLoaderService } from './ads/ads-loader.service';

describe('AppComponent', () => {
  const adsLoaderServiceSpy = {} as any;
  adsLoaderServiceSpy.palSessionLoaded = jasmine.createSpyObj("EventEmitter", ['subscribe']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: AdsLoaderService, useValue: adsLoaderServiceSpy},
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'PAL Web App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('PAL Web App');
  });
});
