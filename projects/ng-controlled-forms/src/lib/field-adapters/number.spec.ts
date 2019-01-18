import {async} from '@angular/core/testing';
import {NumberFieldAdapter} from './number';

describe('NumberFieldAdapter', () => {

  let input: NumberFieldAdapter;
  let inputElem: HTMLInputElement;

  beforeEach(async(() => {
    inputElem = document.createElement('input');
    inputElem.setAttribute('type', 'number');
    input = new NumberFieldAdapter(inputElem);
  }));

  it('should create', () => {
    expect(input).toBeTruthy();
  });

  it('should update a number', () => {
    input.fieldValue = 5;
    expect(input.fieldValue).toEqual(5);

    input.fieldValue = 5.4;
    expect(input.fieldValue).toEqual(5.4);
  });

  it('should dispatch value change on input', (done) => {

    input.valueChanged.subscribe((value) => {
      expect(value).toEqual(5);
      expect(value).not.toBeNaN();
      done();
    });
    inputElem.value = '5';
    inputElem.dispatchEvent(new Event('input'));
  });

  it('should change its value to empty string when passing null', (done) => {

    input.valueChanged.subscribe((value) => {
      expect(value).toEqual('');
      done();
    });
    inputElem.value = null;
    inputElem.dispatchEvent(new Event('input'));
  });

  it('should change its value to empty string when passing undefined', (done) => {

    input.valueChanged.subscribe((value) => {
      expect(value).toEqual('');
      done();
    });
    inputElem.value = undefined;
    inputElem.dispatchEvent(new Event('input'));
  });

});
