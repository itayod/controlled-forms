import {async} from '@angular/core/testing';
import {BooleanCheckboxFieldAdapter} from './booleanCheckbox';

describe('BooleanCheckboxFieldAdapter', () => {

  let booleanCheckbox: BooleanCheckboxFieldAdapter;
  let checkboxElem: HTMLInputElement;

  beforeEach(async(() => {
    checkboxElem = document.createElement('input');
    checkboxElem.setAttribute('type', 'checkbox');
    booleanCheckbox = new BooleanCheckboxFieldAdapter(checkboxElem);
  }));

  it('should create', () => {
    expect(booleanCheckbox).toBeTruthy();
    expect(booleanCheckbox.fieldValue).toBeFalsy();
  });

  it('should set value to true', () => {
    booleanCheckbox.fieldValue = true;
    expect(booleanCheckbox.fieldValue).toBeTruthy();
  });

  it('should dispatch value on click', (done) => {

    booleanCheckbox.valueChanged.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
    checkboxElem.click();
    checkboxElem.dispatchEvent(new Event('change'));
  });

});
