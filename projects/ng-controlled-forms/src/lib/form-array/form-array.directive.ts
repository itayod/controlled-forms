import {Directive, Input, OnInit, forwardRef, Optional, SkipSelf, Inject, EventEmitter, OnDestroy, Host} from '@angular/core';
import {FieldAdapter, IFormContainer, IFormField} from '../ng-controlled-forms.models';
import {FORM_CONTAINER} from '../constants';
import {FormContainer} from '../form-container';
import {isEmpty, compactArray, hasValue} from '../utils';


@Directive({
  selector: '[ctrlFormArray]',
  exportAs: 'formArray',
  providers: [{provide: FORM_CONTAINER, useExisting:  forwardRef(() => FormArrayDirective )}],
})
export class FormArrayDirective extends FormContainer implements OnInit, OnDestroy {

  protected _value = [];
  private _ctrlFormArray: string;

  @Input() set fieldValue(value: any) {
    this._value = value || [];
    this.setFieldsValue(this._value);
  }

  get fieldValue(): any {
    return this._value;
  }

  @Input() set ctrlFormArray(ctrlFormName: string) {
    this._ctrlFormArray = ctrlFormName;
    // support dynamic field name.
    this.signField(ctrlFormName, this);
  }

  get ctrlFormArray(): string {
    return this._ctrlFormArray;
  }

  constructor(@Host() @Optional() @SkipSelf() @Inject(FORM_CONTAINER) public parent: IFormContainer) {
    super();
  }

  public ngOnInit(): void {
    if (this.parent && !this.parent.hasField(this)) {
      this.parent.registerField(this, this.ctrlFormArray, this.errorsChanged, this);
    }
  }

  public ngOnDestroy(): void {
    this.formFields.forEach(formField => {
      formField.valueSubscription.unsubscribe();
      formField.errorsSubscription.unsubscribe();
    });
    this.errorsChanged$.unsubscribe();
    this.unSignField(this.getField());
  }

  public addRow(rowData: any) {
    const value = this.fieldValue.concat([rowData]);
    this.valueChanged.emit(value);
  }

  public removeRow(i) {
    const value = this.fieldValue.filter((row, index) => i !== index);
    this.valueChanged.emit(value);
  }

  fieldValueChange(value: any, index: number) {
    this.valueChanged.emit(this.calcNewValue(value, this.fieldValue, index));
  }

  registerField(field: FieldAdapter, fieldName: string, errorsChanged$: EventEmitter<any>, formField: IFormField) {
    // update then field value for case when from data updated before we registered the field.
    const fieldIndex = this.formFields.length;

    // first declare error subscription for cases that the default value is invalid.
    const errorsSubs = errorsChanged$.subscribe(err => {
      this.fieldErrorChange(fieldIndex, err);
    });

    if (hasValue(this.fieldValue[fieldIndex])) {
      formField.fieldValue = this.fieldValue[fieldIndex];
    }

    const valuesSubs = field.valueChanged.subscribe(val => this.fieldValueChange(val, fieldIndex));

    this.formFields.push({
      name: fieldIndex,
      field: field,
      valueSubscription: valuesSubs,
      errorsSubscription: errorsSubs,
      formField: formField
    });

    // update the init value of the field with the value of the form.
    this._value = this.calcNewValue(field.fieldValue, this.fieldValue, fieldIndex);
  }

  calcNewValue(rowValue: any, formValue: Array<any>, index: number) {
    if (index > formValue.length) {
      return formValue.concat([rowValue]);
    }
    return formValue.map((row, aIndex) => index === aIndex ? rowValue : row);
  }

  protected calcNewErrors(errors: Map<string, boolean>, error: Map<string, boolean>, field: string): Map<string, boolean> | null {
    const err = this.mergeFieldErrors(errors, error, field);
    return isEmpty(err) ? null : err as Map<string, boolean>;
  }

  protected setFieldsValue(value: Array<any>) {
    value.forEach((val, i) => {
      if (this.formFields[i]) {
        this.formFields[i].formField.fieldValue = val;
      }
    });
  }

  public getFieldName(): string {
    return this.ctrlFormArray;
  }

  public getField(): FieldAdapter {
    return this;
  }

  protected mergeFieldErrors(errorRow: any, fieldErrors: Map<string, boolean>, field: any): any {
    if (errorRow) {
      if (fieldErrors) {
        const newErrors = [...errorRow];
        newErrors[field] = fieldErrors;
        return newErrors;
      }

      const filteredErrors = errorRow.map((err, i) => i === field ? fieldErrors : err);
      return compactArray(filteredErrors).length === 0 ? null : filteredErrors;
    } else {
      if (fieldErrors) {
        const errors = [];
        errors[field] = fieldErrors;
        return errors;
      }
      return null;
    }
  }

  removeField(field: IFormField) {

    this.formFields = this.formFields.filter((f) => {
      if (f.formField === field) {
        f.valueSubscription.unsubscribe();
        f.errorsSubscription.unsubscribe();
        return false;
      }
      return true;
    });
    let errors = [];
    this.formFields.forEach(f => {
     errors = this.calcNewErrors(<any>errors, f.formField.errors, <any>f.name) as any;
    });
    this.errorsChanged.emit(<any>errors);
  }

}
