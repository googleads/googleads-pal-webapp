import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearAdRendererComponent } from './linear-ad-renderer.component';
import { ElementRef } from '@angular/core';

describe('LinearAdRendererComponent', () => {
  let component: LinearAdRendererComponent;
  let fixture: ComponentFixture<LinearAdRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearAdRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearAdRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
