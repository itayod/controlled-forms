import {EventEmitter} from '@angular/core';
import {FieldAdapter} from '../ng-controlled-forms.models';
import {hasValue} from '../utils';


// TODO: use angular renderer to set value
export class InputFieldAdapter implements FieldAdapter {

  public valueChanged = new EventEmitter<string>();

  set fieldValue(value: string) {
    this.element.value = !hasValue(value) ? '' : value;
  }

  get fieldValue() {
    return this.element.value;
  }

  constructor(private element: HTMLInputElement, defaultValue: string = '') {
    this.fieldValue = defaultValue;
    this.element.oninput = this.onInputHandler;
  }

  onInputHandler = (event) => {
    this.valueChanged.emit(event.target.value);
  }

}
