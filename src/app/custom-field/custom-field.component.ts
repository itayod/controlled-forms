import {Component, EventEmitter, forwardRef} from '@angular/core';
import {FieldAdapter} from '../../../projects/ng-controlled-forms/src/lib/ng-controlled-forms.models';
import {CUSTOM_FIELD} from '../../../projects/ng-controlled-forms/src/lib/constants';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  providers: [{provide: CUSTOM_FIELD, useExisting:  forwardRef(() => CustomFieldComponent )}],
  styleUrls: ['./custom-field.component.scss']
})
export class CustomFieldComponent implements FieldAdapter<string> {

  private _fieldValue: string;

  set fieldValue(fieldValue: string) {
    this._fieldValue = fieldValue || '';
  }

  get fieldValue() {
    return this._fieldValue;
  }

  public valueChanged = new EventEmitter<string>();

  constructor() { }

  public onInput(event) {
    this.valueChanged.emit(event.target.value);
  }

}
