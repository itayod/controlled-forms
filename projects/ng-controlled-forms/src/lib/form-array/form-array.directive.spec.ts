import {Component, DebugElement} from '@angular/core';
import {TestBed, ComponentFixture, async} from '@angular/core/testing';

import {By} from '@angular/platform-browser';
import {FormFieldDirective} from '../form-field/form-field.directive';
import {Validators} from '../validators';
import {FormArrayDirective} from './form-array.directive';


@Component({
  selector: 'al-test-component',
  template: `
  <div ctrlFormArray [fieldValue]="value" (valueChanged)="valueChanged($event)" (errorsChanged)="errorChanged($event)">
    <input ctrlFormField [validators]="fieldAValidators">
    <input ctrlFormField>
  </div>
  `
})
class TestComponent {
  public value = ['test1', 'test2'];
  public errors = null;

  public fieldAValidators = [Validators.required];
  public valueChanged(value) {
    this.value = value;
  }
  public errorChanged(errors) {
    this.errors = errors;
  }


}

describe('FormArrayDirective', () => {

  let fixture: ComponentFixture<any>;
  let formArrayInstance: FormArrayDirective;
  let directiveEl: DebugElement;
  let childrenEl: Array<DebugElement>;
  let childrenInstance: Array<FormFieldDirective>;
  let inputElems: Array<HTMLInputElement>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFieldDirective, TestComponent, FormArrayDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(By.directive(FormArrayDirective));
    formArrayInstance = directiveEl.injector.get(FormArrayDirective);
    childrenEl = fixture.debugElement.queryAll(By.directive(FormFieldDirective));
    childrenInstance = childrenEl.map(el => el.injector.get(FormFieldDirective));
    inputElems = childrenEl.map(el => el.nativeElement);

  });

  it('should create an instance', () => {
    expect(formArrayInstance).toBeTruthy();
    expect(childrenInstance.length).toEqual(2);
  });

  it('should update the field value on child value change', () => {
    fixture.detectChanges();
    expect(formArrayInstance.fieldValue).toEqual(['test1', 'test2']);
    inputElems[0].value = 'new value';
    inputElems[0].dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(formArrayInstance.fieldValue[0]).toEqual('new value');
  });

  it('should update children field value', () => {
    fixture.componentInstance.value = ['new value', 'new value 2'];
    fixture.detectChanges();

    expect(childrenInstance[0].fieldValue).toEqual('new value');
    expect(childrenInstance[1].fieldValue).toEqual('new value 2');
    expect(inputElems[0].value).toEqual('new value');
    expect(inputElems[1].value).toEqual('new value 2');
  });

  it('should update the errors on child error change', (done) => {
    spyOn(fixture.componentInstance, 'errorChanged');
    fixture.componentInstance.value = ['', 'new value 2'];
    fixture.detectChanges();
    setTimeout(() => {
      expect(fixture.componentInstance.errorChanged).toHaveBeenCalledWith([{required: true}]);
      expect(formArrayInstance.errors).toEqual([{required: true}]);
      done();
    });
  });

});
