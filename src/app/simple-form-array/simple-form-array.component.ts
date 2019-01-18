import {Component, OnInit, ViewChild} from '@angular/core';
import {Validators} from '../../../projects/ng-controlled-forms/src/lib/validators';

@Component({
  selector: 'app-simple-form-array',
  templateUrl: './simple-form-array.component.html',
  styleUrls: ['./simple-form-array.component.scss']
})
export class SimpleFormArrayComponent implements OnInit {

  @ViewChild('formArray') formArrayDir;

  public formArrayValue: any = [];
  public defaultRow = {label: 'label', key: 'key', blabla: {key2: 'ddd'}};
  public errors: any;
  public validators = [Validators.required];

  constructor() { }

  ngOnInit() {
  }

  formArrayValueChanged(form) {
    console.log('form array value changed: ', form);
    this.formArrayValue = form;
  }

  formArrayErrorChanged(errors) {
    console.log('form array errors changed: ', errors);
    this.errors = errors;
  }

  addRow() {
    this.formArrayDir.addRow({...this.defaultRow});
  }

  removeRow(i) {
    this.formArrayDir.removeRow(i);
    // this.formArrayValue = this.formArrayValue.filter((row, index) => i !== index);
  }

  trackByFn(index) {
    return index;
  }
}
