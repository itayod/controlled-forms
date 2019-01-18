import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMatSliderComponent } from './custom-mat-slider.component';

describe('CustomMatSliderComponent', () => {
  let component: CustomMatSliderComponent;
  let fixture: ComponentFixture<CustomMatSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMatSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMatSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
