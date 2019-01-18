import {Component, forwardRef, EventEmitter} from '@angular/core';
import {FieldAdapter, CUSTOM_FIELD} from 'ng-controlled-forms';

@Component({
  selector: '<%= prefix %>-<%= dasherize(name) %>',
  templateUrl: './<%= dasherize(name) %>.component.html',
  providers: [{provide: CUSTOM_FIELD, useExisting:  forwardRef(() => <%= classify(name) %>Component )}],
  styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>']
})
export class <%= classify(name) %>Component implements FieldAdapter<T> {

  public fieldValue: T;
  public valueChanged = new EventEmitter<T>();

  constructor() { }

}
