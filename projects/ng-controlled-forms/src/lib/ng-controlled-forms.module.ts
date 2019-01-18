import {NgModule} from '@angular/core';
import {FormFieldDirective} from './form-field/form-field.directive';
import {FormDirective} from './form/form.directive';
import { FormArrayDirective } from './form-array/form-array.directive';

export const directives = [FormDirective, FormFieldDirective, FormArrayDirective];

@NgModule({
  imports     : [],
  declarations: directives,
  exports     : directives
})
export class NgControlledFormsModule {
}
