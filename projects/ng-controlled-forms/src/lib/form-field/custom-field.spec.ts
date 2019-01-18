import {Component, EventEmitter, forwardRef, ViewChild} from '@angular/core';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FieldAdapter, ValidationError} from '../ng-controlled-forms.models';
import {CUSTOM_FIELD} from '../constants';
import {Validators} from '../validators';
import {FormFieldDirective} from './form-field.directive';

@Component({
  selector: 'al-test-component',
  template: `<al-custom-field #customElem ctrlFormField [fieldValue]="value" (valueChanged)="valueChanged(value)" [validators]="validators"></al-custom-field>`
})
class TestComponent {
  @ViewChild('customElem') customField;

  public value = 'test';
  public validators = [Validators.required];
  public valueChanged(value) {
    this.value = value;
  }

}

@Component({
  selector: 'al-custom-field',
  template: '<input [value]="fieldValue" (input)="onInput($event)">',
  providers: [{provide: CUSTOM_FIELD, useExisting:  forwardRef(() => CustomFieldComponent )}],
})
export class CustomFieldComponent implements FieldAdapter<string> {
  private _value: string;

  set fieldValue(value) {
    this._value = value;
    const error = Validators.minLength(3)(value);

    this.errorsChanged.emit(error);
  }
  get fieldValue() {
    return this._value;
  }

  public valueChanged = new EventEmitter<string>();
  public errorsChanged = new EventEmitter<ValidationError>();

  public onInput(event) {
    this.valueChanged.emit(event.target.value);
  }
}


describe('CustomFormField', () => {

  let fixture: ComponentFixture<any>;
  let directiveEl;
  let directiveInstance: FormFieldDirective;
  let customComponentInstance: CustomFieldComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldDirective, TestComponent, CustomFieldComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(By.directive(FormFieldDirective));
    directiveInstance = directiveEl.injector.get(FormFieldDirective);
    customComponentInstance = fixture.componentInstance.customField;
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
    fixture.componentInstance.value = 'a';
    fixture.detectChanges();
    expect(directiveInstance.errors.minlength).toBeTruthy();

    fixture.componentInstance.value = '';
    fixture.detectChanges();
    expect(directiveInstance.errors.required).toBeTruthy();

    fixture.componentInstance.value = 'long string';
    fixture.detectChanges();
    expect(directiveInstance.errors).toBeNull();
  });

  it('should merge errors correctly', () => {
    fixture.componentInstance.value = '';
    fixture.detectChanges();
    customComponentInstance.errorsChanged.emit({customError: true});
    expect(directiveInstance.errors.required).toBeTruthy();
    expect(directiveInstance.errors.customError).toBeTruthy();

  });

});
