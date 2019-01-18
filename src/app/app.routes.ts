import {Routes} from '@angular/router';
import {NestedFormComponent} from './nested-form/nested-form.component';
import {SimpleFormArrayComponent} from './simple-form-array/simple-form-array.component';
import {SimpleFormComponent} from './simple-form/simple-form.component';

export const routes: Routes = [
  {path: 'simple-form', component: SimpleFormComponent},
  {path: 'form-array', component: SimpleFormArrayComponent},
  {path: 'nested-form', component: NestedFormComponent},
]
