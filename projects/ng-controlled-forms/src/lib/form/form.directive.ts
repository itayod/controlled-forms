import {Directive, Input, Optional, OnInit, SkipSelf, OnDestroy, forwardRef, Inject, EventEmitter, AfterViewInit, Host} from '@angular/core';
import {FieldAdapter, IFormContainer, IFormField} from '../ng-controlled-forms.models';
import {FORM_CONTAINER} from '../constants';
import {FormContainer} from '../form-container';
import {isEmpty, hasValue} from '../utils';

@Directive({
  selector: '[ctrlFormGroup]',
  exportAs: 'form',
  providers: [{provide: FORM_CONTAINER, useExisting:  forwardRef(() => FormDirective )}],
})
export class FormDirective extends FormContainer implements OnInit, OnDestroy {

  protected _value = {};
  private _ctrlForm: string;

  @Input() set fieldValue(value: any) {
    this._value = value || {};
    this.setFieldsValue(this._value);
  }

  get fieldValue(): any {
    return this._value;
  }

  @Input() set ctrlForm(ctrlFormName: string) {
    this._ctrlForm = ctrlFormName;
    // support dynamic field name.
    this.signField(ctrlFormName, this);
  }

  get ctrlForm(): string {
    return this._ctrlForm;
  }

  constructor(@Host() @Optional() @SkipSelf() @Inject(FORM_CONTAINER) public parent: IFormContainer) {
    super();
  }

  public ngOnInit(): void {
    if (this.parent && !this.parent.hasField(this)) {
      this.parent.registerField(this, this.ctrlForm, this.errorsChanged, this);
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

  fieldValueChange(field: string, value: any) {
    this.valueChanged.emit(this.calcNewValue(field, value, this.fieldValue));
  }

  registerField(field: FieldAdapter, fieldName: string, errorsChanged$: EventEmitter<any>, formField: IFormField) {
    // update then field value for case when from data updated before we registered the field.
    if (hasValue(this.fieldValue[fieldName])) {
      field.fieldValue = this.fieldValue[fieldName];
    }

    const valueS = field.valueChanged.subscribe(val => this.fieldValueChange(fieldName, val));
    const errorsS = errorsChanged$.subscribe(err => {
      this.fieldErrorChange(fieldName, err);
    });

    this.formFields.push({name: fieldName, field: field, valueSubscription: valueS, errorsSubscription: errorsS, formField: formField});

    // update the init value of the field with the value of the form.
    this._value = this.calcNewValue(fieldName, field.fieldValue, this.fieldValue);
  }

  protected calcNewValue(field: string, value: any, formValue) {
    return {...formValue, [field]: value};
  }

  protected calcNewErrors(errors: Map<string, boolean>, error: Map<string, boolean>, field: string): Map<string, boolean> | null {
    const err = this.mergeFieldErrors(errors, error, field);
    return isEmpty(err) ? null : err as Map<string, boolean>;
  }

  protected setFieldsValue(value: {[key: string]: any}) {
    this.formFields.forEach((fieldRow) => fieldRow.formField.fieldValue = value[fieldRow.name]);
  }

  public getFieldName(): string {
    return this.ctrlForm;
  }

  public getField(): FieldAdapter {
    return this;
  }

  protected mergeFieldErrors(errorRow: Map<string, boolean>, fieldErrors: Map<string, boolean>, field: string) {
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
