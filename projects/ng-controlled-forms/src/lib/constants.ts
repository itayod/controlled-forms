import {InjectionToken} from '@angular/core';

export const INPUT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  SELECTONE: 'select-one',
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
};

export const INPUT_TAG_NAME = {
  INPUT: 'INPUT',
  TEXTAREA: 'TEXTAREA',
  SELECT: 'SELECT',
};

export const CUSTOM_FIELD = new InjectionToken('custom.field.adapter');
export const FORM_CONTAINER = new InjectionToken('FORM_CONTAINER');
