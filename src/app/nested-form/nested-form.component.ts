import {Component} from '@angular/core';
import {Validators} from '../../../projects/ng-controlled-forms/src/lib/validators';

@Component({
  selector: 'app-nested-form',
  templateUrl: './nested-form.component.html',
  styleUrls: ['./nested-form.component.scss']
})
export class NestedFormComponent  {

  lsKey = 'localStorage';
  formVal: {array: Array<{firstName: string; lastName: string}>};
  defaultRow = <{firstName: string; lastName: string}>{firstName: 'Eric', lastName: 'Cartman'};
  formErrors = null;

  validators = [Validators.required];

  constructor() {
    const form = localStorage.getItem(this.lsKey) || '{}';
    this.formVal = JSON.parse(form);
  }

  public formValueChanged(value) {
    this.formVal = value;
    console.log('form value changed: ', value);
  }

  public formErrorChanged(error) {
    this.formErrors = error;
    // console.log('form errors changed: ', error);
  }

  trackByFn(index) {
    return index;
  }

  saveToLocalStorage() {
    localStorage.setItem(this.lsKey, JSON.stringify(this.formVal));
  }

  // public addRow() {
  //   this.formVal.concat([this.defaultRow]);
  // }
}
