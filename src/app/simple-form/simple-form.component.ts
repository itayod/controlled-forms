import { Component, OnInit } from '@angular/core';
import {Validators} from '../../../projects/ng-controlled-forms/src/lib/validators';

@Component({
  selector: 'app-simple-form',
  templateUrl: './simple-form.component.html',
  styleUrls: ['./simple-form.component.scss']
})
export class SimpleFormComponent {

  public cities = [];

  lsKey = 'localStorage';
  public input: any;
  public form;
  public errors: any;

  validators = [Validators.required];
  validators2 = [Validators.min(2)];

  constructor() {
    const form = localStorage.getItem(this.lsKey) || '{}';
    this.form = JSON.parse(form);
    const storageInput = localStorage.getItem('input');
    this.input =  storageInput ? JSON.parse(storageInput) : '';
    setTimeout(() => {
      this.cities = ['ramatgan', 'telaviv'];
    }, 1000);
  }

  inputValChanged(value) {
    this.input = value;
    console.log('input value: ', value);
  }

  formValueChanged(value) {
    this.form = value;
    console.log('form value: ', value);
  }

  errorChanged(errors) {
    console.log('form errors: ', errors);
    this.errors = errors;
  }

  saveToLocalStorage() {
    localStorage.setItem(this.lsKey, JSON.stringify(this.form));
  }

  saveInputToLocalStorage() {
    localStorage.setItem('input', JSON.stringify(this.input));
  }


}
