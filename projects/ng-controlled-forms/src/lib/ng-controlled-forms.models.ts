import {EventEmitter} from '@angular/core';
import {FormContainer} from './form-container';

export declare interface ValidationError {
  [key: string]: any;
}

export type ValidatorFunction = (value: any) => ValidationError | null;


export interface FieldAdapter<T = any> {
  valueChanged: EventEmitter<T>;
  fieldValue: T;
  errorsChanged?: EventEmitter<any>;
}

export interface IFormField<T = any> extends FieldAdapter {
  parent: IFormContainer;
  errors: any;
  validators: Array<ValidatorFunction>;
}

export interface IFormContainer<T = any> extends IFormField {
  hasField: (field: IFormField) => boolean;
  removeField: (field: IFormField) => void;
  registerField: (field: IFormField, fieldName: string, errorsChanged$: EventEmitter<any>, IFormField) => void;
  updateError: (fieldName: string, errors: Map<string, boolean>) => void;
}



