import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FieldAdapter} from '../ng-controlled-forms.models';

export class FormControlAdapter implements FieldAdapter {

  public valueChanged = new EventEmitter<string>();

  set fieldValue(value: string) {
    this.control.setValue(value, {onlySelf: true, emitEvent: false});
  }

  get fieldValue() {
    return this.control.value;
  }

  constructor(private control: FormControl, defaultValue: any) {
    this.fieldValue = defaultValue;
    control.valueChanges.subscribe((value) => {
      this.valueChanged.emit(value);
    });
  }

}
