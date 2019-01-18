import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FieldAdapter} from '../ng-controlled-forms.models';


// TODO: use angular renderer to set value
export class CheckboxFieldAdapter implements FieldAdapter<Array<any>> {

  private _value = [];

  public valueChanged = new EventEmitter<Array<any>>();

  set fieldValue(value: Array<any>) {
    this._value = value;
    if (Array.isArray(value)) {
      this.element.checked = value.includes(this.element.value);
    }
  }

  get fieldValue() {
    return this._value;
  }

  constructor(private element: HTMLInputElement, defaultValue = []) {
    this.fieldValue = defaultValue;
    this.element.onchange = this.onInputHandler;
  }

  onInputHandler = (event) => {
    const newVal = this.element.checked ?
          this.fieldValue.concat([this.element.value]) :
          this.fieldValue.filter(val => val !== this.element.value);
    this.valueChanged.emit(newVal);
  }

}
