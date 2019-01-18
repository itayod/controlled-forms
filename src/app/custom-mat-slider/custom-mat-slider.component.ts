import {Component, forwardRef, EventEmitter} from '@angular/core';
import {FieldAdapter} from '../../../projects/ng-controlled-forms/src/lib/ng-controlled-forms.models';
import {CUSTOM_FIELD} from '../../../projects/ng-controlled-forms/src/lib/constants';

@Component({
  selector: 'app-custom-mat-slider',
  templateUrl: './custom-mat-slider.component.html',
  providers: [{provide: CUSTOM_FIELD, useExisting:  forwardRef(() => CustomMatSliderComponent )}],
  styleUrls: ['./custom-mat-slider.component.scss']
})
export class CustomMatSliderComponent implements FieldAdapter<number> {

  public fieldValue: number;
  public valueChanged = new EventEmitter<number>();

  constructor() { }

  change(event) {
    this.valueChanged.emit(event.value);
  }

}
