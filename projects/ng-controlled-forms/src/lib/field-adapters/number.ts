import {EventEmitter} from '@angular/core';
import {FieldAdapter} from '../ng-controlled-forms.models';


// TODO: use angular renderer to set value
export class NumberFieldAdapter implements FieldAdapter<number | ''> {

  public valueChanged = new EventEmitter<number>();

  set fieldValue(value: number | '') {
    // @ts-ignore (allow empty value...).
    this.element.value = !value && value !== 0 ? '' : Number(value);
  }

  get fieldValue() {
    // @ts-ignore (allow empty value...).
    return this.element.value === '' ? '' : Number(this.element.value);
  }

  constructor(private element: HTMLInputElement, defaultValue = '') {
    // @ts-ignore (allow empty value...).
    this.fieldValue = defaultValue;
    this.element.oninput = this.onInputHandler;
  }

  onInputHandler = (event) => {
    const newValue = !event.target.value && event.target.value !== 0 ? '' : Number(event.target.value);
    // @ts-ignore (allow empty value...).
    this.valueChanged.emit(newValue);
  }


}
