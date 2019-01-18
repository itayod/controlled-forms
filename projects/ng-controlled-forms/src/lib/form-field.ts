import {Output, EventEmitter, Input} from '@angular/core';
import {FieldAdapter, IFormField, ValidatorFunction, ValidationError} from './ng-controlled-forms.models';
import {isEqual, isEmpty} from './utils';

export abstract class FormField implements IFormField {

  protected _value;
  public abstract parent: any;
  public abstract fieldValue: { [key: string]: any };

  public errors: any;

  @Input() validators: Array<ValidatorFunction>;

  @Output() valueChanged  = new EventEmitter<any>();
  @Output() errorsChanged = new EventEmitter<Map<string, boolean>>();

  constructor() {}

  updateValue(value) {
    this.valueChanged.emit(value);
  }

  updateError(errors) {
    if (!isEqual(errors, this.errors, false)) {
      this.errors = errors;
      this.errorsChanged.emit(errors);
    }
  }

  unSignField(field: FieldAdapter) {
    if (this.parent) {
      this.parent.removeField(this);
    }
  }

  signField(fieldName: string, field: FieldAdapter) {
    if (!field || !this.parent) {return; }
    if (this.parent.hasField(field)) {
      this.parent.removeField(field);
    }
    this.parent.registerField(field, fieldName, this.errorsChanged, this);
  }

  protected mergeErrors(err1: ValidationError | null, err2: ValidationError | null) {
    const newErrors = {...err1, ...err2};

    return isEmpty(newErrors) ? null : newErrors;
  }
}
