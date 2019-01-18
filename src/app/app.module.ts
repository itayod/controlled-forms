import {NgModule} from '@angular/core';
import {MatTabsModule} from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgControlledFormsModule} from '../../projects/ng-controlled-forms/src/lib/ng-controlled-forms.module';

import {AppComponent} from './app.component';
import {routes} from './app.routes';
import {CustomFieldComponent} from './custom-field/custom-field.component';
import { CustomMatSliderComponent } from './custom-mat-slider/custom-mat-slider.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SimpleFormComponent } from './simple-form/simple-form.component';
import { SimpleFormArrayComponent } from './simple-form-array/simple-form-array.component';
import { NestedFormComponent } from './nested-form/nested-form.component';


@NgModule({
  imports: [
    BrowserModule,
    NgControlledFormsModule,
    MatTabsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    MatSliderModule,
  ],
  declarations: [
    AppComponent,
    CustomFieldComponent,
    CustomMatSliderComponent,
    SimpleFormComponent,
    SimpleFormArrayComponent,
    NestedFormComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
