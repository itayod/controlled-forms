import {EventEmitter} from '@angular/core';
import {FieldAdapter} from '../ng-controlled-forms.models';


// TODO: use angular renderer to set value
export class BooleanCheckboxFieldAdapter implements FieldAdapter<boolean> {

  private _value = false;

  public valueChanged = new EventEmitter<boolean>();

  set fieldValue(value: boolean) {
    this._value = value;
    this.element.checked = !!value;
  }

  get fieldValue() {
    return this._value;
  }

  constructor(private element: HTMLInputElement, defaultValue = false) {
    this.fieldValue = defaultValue;
    this.element.onchange = this.onInputHandler;
  }

  onInputHandler = (event) => {
    const newVal = this.element.checked;
    this.valueChanged.emit(newVal);
  }

}
