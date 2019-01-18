import {EventEmitter, Input} from '@angular/core';
import {Subscription, Subject} from 'rxjs';
import {tap, debounceTime, mapTo, filter, map, bufferTime, distinctUntilChanged} from 'rxjs/operators';
import {FieldAdapter, IFormField} from './ng-controlled-forms.models';
import {FormField} from './form-field';

export abstract class FormContainer extends FormField {

  protected _value;
  // TODO: refactor to Array<IFormField>!!.
  protected formFields: Array<{
    name: string | number,
    field: FieldAdapter,
    valueSubscription: Subscription,
    errorsSubscription: Subscription,
    formField: IFormField
  }> = [];
  protected errorsChanged$ = new Subject<{ field: string | number, error: Map<string, boolean> }>();
  private _errors: any;

  constructor() {
    super();
    let events = [];
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

  abstract registerField(field: FieldAdapter, fieldName: string, errorsChanged$: EventEmitter<any>, formField: IFormField);
  abstract getFieldName(): string;
  abstract getField(): FieldAdapter;

  removeField(field: IFormField) {
    this.formFields = this.formFields.filter((f, index) => {
      if (f.formField === field) {
        f.valueSubscription.unsubscribe();
        f.errorsSubscription.unsubscribe();
        if (field.errors) {
          // console.log(field, f.name);
          this.fieldErrorChange(f.name, null);
        }
        return false;
      }
      return true;
    });
  }


  hasField(field: FieldAdapter) {
    return !!this.formFields.find(formField => formField.field === field);
  }

  fieldErrorChange(field: string | number, error: Map<string, boolean>) {
    this.errorsChanged$.next({field: field, error: error});
  }

  protected abstract setFieldsValue(value: any);

  protected abstract calcNewErrors(errors: any, error: any, field: FieldAdapter | string);

}
