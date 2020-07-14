import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanionAdRendererComponent } from './companion-ad-renderer.component';

describe('ComponentAdRendererComponent', () => {
  let component: CompanionAdRendererComponent;
  let fixture: ComponentFixture<CompanionAdRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanionAdRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanionAdRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
