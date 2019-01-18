import {async} from '@angular/core/testing';
import {InputFieldAdapter} from './input';

describe('InputFieldAdapter', () => {

  let input: InputFieldAdapter;
  let inputElem: HTMLInputElement;

  beforeEach(async(() => {
    inputElem = document.createElement('input');
    inputElem.setAttribute('type', 'checkbox');
    input = new InputFieldAdapter(inputElem);
  }));

  it('should create', () => {
    expect(input).toBeTruthy();
    expect(input.fieldValue).toEqual('');
  });

  it('should set value', () => {
    input.fieldValue = 'test2';
    expect(input.fieldValue).toEqual('test2');
  });

  it('should dispatch value change on input', (done) => {

    input.valueChanged.subscribe((value) => {
      expect(value).toEqual('test');
      done();
    });
    inputElem.value = 'test';
    inputElem.dispatchEvent(new Event('input'));
  });

});
