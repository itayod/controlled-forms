import {Directive, Input, Optional, OnInit, SkipSelf, OnDestroy, forwardRef,
  Inject, EventEmitter, Host} from '@angular/core';
import {FORM_CONTAINER} from '../constants';
import {FormContainer} from '../form-container';
import {FieldAdapter, IFormContainer, IFormField} from '../ng-controlled-forms.models';
import {isEmpty, hasValue} from '../utils';

@Directive({
  selector: '[ctrlFormGroup]',
  exportAs: 'form',
  providers: [{provide: FORM_CONTAINER, useExisting:  forwardRef(() => FormDirective )}],
})
export class FormDirective extends FormContainer implements OnInit, OnDestroy {

  protected _value = {};
  private _ctrlFormGroup: string;

  @Input() set fieldValue(value: any) {
    this._value = value || {};
    this.setFieldsValue(this._value);
  }

  get fieldValue(): any {
    return this._value;
  }

  @Input() set ctrlFormGroup(ctrlFormkey: string) {
    this._ctrlFormGroup = ctrlFormkey;
    // support dynamic field key.
    this.signField(this);
  }

  get ctrlFormGroup(): string {
    return this._ctrlFormGroup;
  }

  get key() {
    return this.ctrlFormGroup;
  }

  constructor(@Host() @Optional() @SkipSelf() @Inject(FORM_CONTAINER) public parent: IFormContainer) {
    super();
  }

  public ngOnInit(): void {
    if (this.parent && !this.parent.hasField(this)) {
      this.parent.registerField(this, this.ctrlFormGroup, this.errorsChanged);
    }
  }

  public ngOnDestroy(): void {
    this.formFields.forEach(formField => {
      formField.valueSubscription.unsubscribe();
      formField.errorsSubscription.unsubscribe();
    });
    this.errorsChanged$.unsubscribe();
    this.unSignField(this);
  }

  fieldValueChange(field: string, value: any) {
    this.valueChanged.emit(this.calcNewValue(field, value, this.fieldValue));
  }

  removeField(field: IFormField) {
    super.removeField(field);
    if (field.errors) {
      this.fieldErrorChange(field.key, null);
    }
  }

  protected calcNewValue(field: string, fieldValue: any, formValue: any) {
    return {...formValue, [field]: fieldValue};
  }

  protected calcNewErrors(errors: {[key: string]: boolean}, error: {[key: string]: boolean}, field: string): {[key: string]: boolean} | null {
    const err = this.mergeFieldErrors(errors, error, field);
    return isEmpty(err) ? null : err as {[key: string]: boolean};
  }

  protected setFieldsValue(value: {[key: string]: any}) {
    this.formFields.forEach((fieldRow) => fieldRow.field.fieldValue = value[fieldRow.key]);
  }

  protected mergeFieldErrors(errorRow: {[key: string]: boolean}, fieldErrors: {[key: string]: boolean}, field: string) {
    if (errorRow) {
      if (fieldErrors) {
        return {...errorRow, [field]: fieldErrors};
      }
      const errorsClone = {...errorRow};
      delete errorsClone[field];
      return errorsClone;
    } else {
      if (fieldErrors) {
        return {[field]: fieldErrors};
      }
      return null;
    }
  }

}
