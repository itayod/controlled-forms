import {Directive, Input, OnInit, forwardRef, Optional, SkipSelf, Inject, EventEmitter, OnDestroy, Host} from '@angular/core';
import {FORM_CONTAINER} from '../constants';
import {FormContainer} from '../form-container';
import {IFormContainer, IFormField} from '../ng-controlled-forms.models';
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

  @Input() set ctrlFormArray(ctrlFormkey: string) {
    this._ctrlFormArray = ctrlFormkey;
    // support dynamic field key.
    this.signField(this);
  }

  get ctrlFormArray(): string {
    return this._ctrlFormArray;
  }

  get key() {
    return this.ctrlFormArray;
  }

  constructor(@Host() @Optional() @SkipSelf() @Inject(FORM_CONTAINER) public parent: IFormContainer) {
    super();
  }

  public ngOnInit(): void {
    if (this.parent && !this.parent.hasField(this)) {
      this.parent.registerField(this, this.ctrlFormArray, this.errorsChanged);
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

  public addRow(rowData: any) {
    const value = this.fieldValue.concat([rowData]);
    this.valueChanged.emit(value);
  }

  public removeRow(i) {
    const value = this.fieldValue.filter((row, index) => i !== index);
    this.valueChanged.emit(value);
  }

  fieldValueChange(index: number, value: any) {
    this.valueChanged.emit(this.calcNewValue(index, value, this.fieldValue));
  }

  registerField(field: IFormField, fieldkey: string, errorsChanged$: EventEmitter<any>) {
    const fieldIndex = this.formFields.length;
    super.registerField(field, fieldIndex, errorsChanged$);
  }

  calcNewValue(index: number, rowValue: any, formValue: Array<any> ) {
    if (index > formValue.length) {
      return formValue.concat([rowValue]);
    }
    return formValue.map((row, aIndex) => index === aIndex ? rowValue : row);
  }

  protected calcNewErrors(errors: {[key: string]: boolean}[], error: {[key: string]: boolean}, field: string): {[key: string]: boolean} | null {
    const err = this.mergeFieldErrors(errors, error, field);
    return isEmpty(err) ? null : err as {[key: string]: boolean};
  }

  protected setFieldsValue(value: Array<any>) {
    value.forEach((val, i) => {
      if (this.formFields[i]) {
        this.formFields[i].field.fieldValue = val;
      }
    });
  }

  protected mergeFieldErrors(errorRows: {[key: string]: boolean}[], fieldErrors: {[key: string]: boolean}, field: string | number): any {
    if (errorRows) {
      if (fieldErrors) {
        const newErrors = [...errorRows];
        newErrors[field] = fieldErrors;
        return newErrors;
      }

      const filteredErrors = errorRows.map((err, i) => i === field ? fieldErrors : err);
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
    super.removeField(field);
    let errors = [];
    this.formFields.forEach(f => {
     errors = this.calcNewErrors(<any>errors, f.field.errors, <any>f.key) as any;
    });
    this.errorsChanged.emit(<any>errors);
  }

}
