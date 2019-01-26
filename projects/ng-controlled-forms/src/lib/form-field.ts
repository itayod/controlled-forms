import {Output, EventEmitter, Input} from '@angular/core';
import {FieldAdapter, IFormField, ValidatorFunction} from './ng-controlled-forms.models';
import {isEqual} from './utils';

export abstract class FormField implements IFormField {

  protected _value;
  public abstract parent: any;
  public abstract key: any;
  public abstract fieldValue: { [key: string]: any };

  public errors: any;

  @Input() validators: Array<ValidatorFunction>;

  @Output() valueChanged  = new EventEmitter<any>();
  @Output() errorsChanged = new EventEmitter<{[key: string]: boolean}>();

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

  unSignField(field: IFormField) {
    if (this.parent) {
      this.parent.removeField(field);
    }
  }

  signField(field: IFormField) {
    if (!field || !this.parent) {return; }
    if (this.parent.hasField(field)) {
      return;
    }
    this.parent.registerField(field, field.key, this.errorsChanged);
  }

}
