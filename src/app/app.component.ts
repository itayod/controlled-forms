import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public navLinks = [
    {path: 'simple-form', label: 'SIMPLE FORM'},
    {path: 'form-array', label: 'FORM ARRAY'},
    {path: 'nested-form', label: 'NESTED FORM'}
  ];
}
