import {async} from '@angular/core/testing';
import {CheckboxFieldAdapter} from './checkbox';

describe('CheckboxFieldAdapter', () => {

  let checkbox: CheckboxFieldAdapter;
  let checkboxElem: HTMLInputElement;
  const CHECKBOX_VALUE = 'test';

  beforeEach(async(() => {
    checkboxElem = document.createElement('input');
    checkboxElem.setAttribute('type', 'checkbox');
    checkboxElem.setAttribute('value', CHECKBOX_VALUE);
    checkbox = new CheckboxFieldAdapter(checkboxElem);
  }));

  it('should create', () => {
    expect(checkbox).toBeTruthy();
    expect(checkbox.fieldValue).toEqual([]);
  });

  it('should set value', () => {
    checkbox.fieldValue = ['test2'];
    expect(checkbox.fieldValue).toEqual(['test2']);
  });

  it('should dispatch value on click', (done) => {

    checkbox.valueChanged.subscribe((value) => {
      expect(value).toEqual([CHECKBOX_VALUE]);
      done();
    });
    checkboxElem.click();
    checkboxElem.dispatchEvent(new Event('change'));
  });

  it('should add value to other checkbox value', (done) => {
    checkbox.fieldValue = ['test2'];
    checkbox.valueChanged.subscribe((value) => {
      expect(value).toEqual(['test2', CHECKBOX_VALUE]);
      done();
    });
    checkboxElem.click();
    checkboxElem.dispatchEvent(new Event('change'));
  });


});
