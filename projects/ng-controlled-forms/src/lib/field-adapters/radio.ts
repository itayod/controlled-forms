import {EventEmitter} from '@angular/core';
import {FieldAdapter} from '../ng-controlled-forms.models';


// TODO: use angular renderer to set value
export class RadioFieldAdapter implements FieldAdapter {

  public valueChanged = new EventEmitter<string>();
  private _value: string;

  set fieldValue(value: string) {
    this._value = value;
    this.element.checked = (value === this.element.value);
  }

  get fieldValue() {
    return this._value;
  }

  constructor(private element: HTMLInputElement, defaultValue?: any) {
    if (defaultValue) {
      this.fieldValue = defaultValue;
    }
    this.element.onchange = this.onInputHandler;
  }

  onInputHandler = (event) => {
    this.valueChanged.emit(event.target.value);
  }


}
