import { LinearAdsReporter } from './linear-ads-reporter';
import { HttpClient } from '@angular/common/http';
import { LinearAdRendererComponent } from './linear-ad-renderer/linear-ad-renderer.component';

describe('LinearAdReporter', () => {
  it('should create an instance', () => {
    const httpClientSpy = {} as any;
    const linearAdRendererSpy = {} as any;
    linearAdRendererSpy.loadedData = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.playStart = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.timeUpdate = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.iconView = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    linearAdRendererSpy.iconClick = jasmine.createSpyObj('EventEmitter', ['subscribe']);
    expect(new LinearAdsReporter(httpClientSpy, linearAdRendererSpy)).toBeTruthy();
  });
});
