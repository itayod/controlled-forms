import {ElementRef, Component} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Validators} from '../validators';
import {FormFieldDirective} from './form-field.directive';

@Component({
  selector: 'ctrlForm-test-component',
  template: '<input ctrlFormField [fieldValue]="value" (valueChanged)="valueChanged(value)" [validators]="validators">'
})
class TestComponent {
  public value = 'test';
  public validators = [Validators.required];
  public valueChanged(value) {
    this.value = value;
  }
}

describe('FormFieldDirective', () => {

  let fixture: ComponentFixture<any>;
  let directiveEl;
  let directiveInstance: FormFieldDirective;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(By.directive(FormFieldDirective));
    directiveInstance = directiveEl.injector.get(FormFieldDirective);

  }));

  it('should create an instance', () => {
    expect(directiveEl).toBeTruthy();
    expect(directiveInstance).toBeTruthy();
  });

  it('should has value ', () => {
    fixture.detectChanges();
    expect(directiveInstance.fieldValue).toEqual('test');
    fixture.componentInstance.value = 'test2';
    fixture.detectChanges();
    expect(directiveInstance.fieldValue).toEqual('test2');
  });

  it('should update field error correctly', () => {
    fixture.componentInstance.value = '';
    fixture.detectChanges();
    expect(directiveInstance.errors.required).toBeTruthy();
    fixture.componentInstance.value = 'test';
    fixture.detectChanges();
    expect(directiveInstance.errors).toBeNull();
  });


});
