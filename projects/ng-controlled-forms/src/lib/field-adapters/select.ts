import {EventEmitter} from '@angular/core';
import {FieldAdapter} from '../ng-controlled-forms.models';


// TODO: use angular renderer to set value
export class SelectFieldAdapter implements FieldAdapter {

  public valueChanged = new EventEmitter<string>();
  private _value: string;

  set fieldValue(value: string) {
    // const optionalValues = [undefined, null, ''];
    // for (let i = 0; i < this.element.children.length; i++) {
    //   optionalValues.push((this.element.children[i] as HTMLOptionElement).value);
    // }
    this._value = value;
    this.element.value = value;//!optionalValues.includes(value) ? this.element.value : value;
  }

  get fieldValue() {
    return this._value;
  }

  constructor(private element: HTMLSelectElement, defaultValue: any = '') {
    this.fieldValue = defaultValue;
    this.element.oninput = this.onInputHandler;
    this.element.addEventListener('DOMNodeInserted', this.onOptionAdded, false);
  }

  onInputHandler = (event) => {
    this.valueChanged.emit(event.target.value);
  }

  onOptionAdded = (event) => {
    if (event.target.nodeName === 'OPTION') {
      setTimeout(() => {
        event.target.selected = event.target.value === this.fieldValue;
      });
    }
  }


}
