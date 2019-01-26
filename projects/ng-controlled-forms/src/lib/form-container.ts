import {EventEmitter} from '@angular/core';
import {Subscription, Subject} from 'rxjs';
import {filter, bufferTime, distinctUntilChanged} from 'rxjs/operators';
import {FormField} from './form-field';
import {FieldAdapter, IFormField} from './ng-controlled-forms.models';
import {hasValue} from './utils';

export abstract class FormContainer extends FormField {

  protected _value;
  // TODO: declare type.
  protected formFields: Array<{
    key: string | number,
    field: IFormField,
    valueSubscription: Subscription,
    errorsSubscription: Subscription
  }> = [];
  protected errorsChanged$ = new Subject<{ field: string | number, error: {[key: string]: boolean} }>();
  private _errors: any;

  constructor() {
    super();
    let events = [];
    // we use bufferTime(0) to collect errors that been fired in the same time.
    this.errorsChanged$
      .pipe(
        distinctUntilChanged(),
        bufferTime(0),
        filter(errorEvents => errorEvents.length > 0),
      )
      .subscribe(errorEvents => {
        let errors = this.errors;
        errorEvents.forEach((errEvent: any) => {
          errors = this.calcNewErrors(errors, errEvent.error, errEvent.field);
        });

        events = [];
        this._errors = errors;
        this.updateError(errors);
      });
  }

  registerField(field: IFormField, fieldkey: string | number, errorsChanged$: EventEmitter<any>) {
    // first declare error subscription for cases that the default value is invalid.
    const errorsSubs = errorsChanged$.subscribe(err => {
      this.fieldErrorChange(fieldkey, err);
    });

    // update the field value for case when from data updated before we registered the field.
    if (hasValue(this.fieldValue[fieldkey])) {
      field.fieldValue = this.fieldValue[fieldkey];
    }

    const valuesSubs = field.valueChanged.subscribe(val => this.fieldValueChange(fieldkey, val));
    this.formFields.push({
      key: fieldkey,
      field: field,
      valueSubscription: valuesSubs,
      errorsSubscription: errorsSubs,
    });

    // update the init value of the field with the value of the form.
    this._value = this.calcNewValue(fieldkey, field.fieldValue, this.fieldValue);
  }

  removeField(field: IFormField) {
    this.formFields = this.formFields.filter((f, index) => {
      if (f.field === field) {
        f.valueSubscription.unsubscribe();
        f.errorsSubscription.unsubscribe();
        if (field.errors) {
          this.fieldErrorChange(f.key, null);
        }
        return false;
      }
      return true;
    });
  }

  hasField(field: IFormField) {
    return !!this.formFields.find(formField => formField.field === field);
  }

  fieldErrorChange(field: string | number, error: {[key: string]: boolean}) {
    this.errorsChanged$.next({field: field, error: error});
  }

  protected abstract setFieldsValue(value: any);

  protected abstract calcNewErrors(errors: any, error: any, field: FieldAdapter | string);
  protected abstract calcNewValue(field: string | number, fieldValue: any, formValue: any);
  protected abstract fieldValueChange(field: string | number, fieldValue: any);

}
