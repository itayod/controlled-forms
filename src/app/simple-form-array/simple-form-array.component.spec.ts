import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleFormArrayComponent } from './simple-form-array.component';

describe('SimpleFormArrayComponent', () => {
  let component: SimpleFormArrayComponent;
  let fixture: ComponentFixture<SimpleFormArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleFormArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
