import {async} from '@angular/core/testing';
import {SelectFieldAdapter} from './select';

describe('SelectFieldAdapter', () => {

  let select: SelectFieldAdapter;
  let selectElem: HTMLSelectElement;
  const OPTION1_VALUE = 'TEST';
  const OPTION2_VALUE = 'TEST2';
  let option1Elem: HTMLOptionElement;
  let option2Elem: HTMLOptionElement;

  beforeEach(async(() => {
    selectElem = document.createElement('select');
    option1Elem = document.createElement('option');
    option1Elem.setAttribute('value', OPTION1_VALUE);
    option2Elem = document.createElement('option');
    option2Elem.setAttribute('value', OPTION2_VALUE);
    selectElem.appendChild(option1Elem);
    selectElem.appendChild(option2Elem);

    select = new SelectFieldAdapter(selectElem);
  }));

  it('should create', () => {
    expect(select).toBeTruthy();
    expect(select.fieldValue).toEqual('');
  });

  it('should select the second option', () => {
    select.fieldValue = OPTION2_VALUE;
    expect(select.fieldValue).toEqual(OPTION2_VALUE);
    expect(selectElem.selectedOptions[0]).toEqual(option2Elem);
    select.fieldValue = '';
    expect(select.fieldValue).toEqual('');
  });

  it('should dispatch valueChange on change', (done) => {

    select.valueChanged.subscribe((value) => {
      expect(value).toEqual(OPTION2_VALUE);
      done();
    });
    selectElem.value = OPTION2_VALUE;
    selectElem.dispatchEvent(new Event('input'));
  });

  it('should update the selected option', (done) => {
    const newOptVal = 'new_option';
    const newOption: HTMLOptionElement = document.createElement('option');
    newOption.value = newOptVal;
    select.fieldValue = newOptVal;
    const eventMock = {target: newOption};
    select.onOptionAdded(eventMock);
    setTimeout(() => {
      expect(select.fieldValue).toEqual(newOptVal);
      expect(newOption.selected).toBeTruthy();
      done();
    });
  });

});
