import {async} from '@angular/core/testing';
import {RadioFieldAdapter} from './radio';

describe('RadioFieldAdapter', () => {

  let radio: RadioFieldAdapter;
  let radioElem: HTMLInputElement;
  const RADIO_VALUE = 'TEST';

  beforeEach(async(() => {
    radioElem = document.createElement('input');
    radioElem.setAttribute('type', 'radio');
    radioElem.setAttribute('value', RADIO_VALUE);
    radio = new RadioFieldAdapter(radioElem);
  }));

  it('should create', () => {
    expect(radio).toBeTruthy();
    expect(radioElem.checked).toBeFalsy();
  });

  it('should become checked', () => {
    radio.fieldValue = RADIO_VALUE;
    expect(radioElem.checked).toBeTruthy();
  });

  it('should become unchecked', () => {
    radio.fieldValue = RADIO_VALUE;
    radio.fieldValue = '';
    expect(radioElem.checked).toBeFalsy();
  });

  it('should dispatch value change on change', (done) => {

    radio.valueChanged.subscribe((value) => {
      expect(radio).toBeTruthy();
      expect(value).toEqual(RADIO_VALUE);
      done();
    });
    radioElem.click();
    radioElem.dispatchEvent(new Event('change'));
  });

});
