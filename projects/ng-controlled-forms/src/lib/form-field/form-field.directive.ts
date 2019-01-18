import {Directive, Input, ElementRef, OnDestroy, OnInit, Inject, Self, Optional, SkipSelf, AfterViewInit, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {FieldAdapter, ValidatorFunction, IFormContainer, ValidationError} from '../ng-controlled-forms.models';
import {CUSTOM_FIELD, INPUT_TYPES, INPUT_TAG_NAME, FORM_CONTAINER} from '../constants';
import {BooleanCheckboxFieldAdapter} from '../field-adapters/booleanCheckbox';
import {CheckboxFieldAdapter} from '../field-adapters/checkbox';
import {FormControlAdapter} from '../field-adapters/formcontrol';
import {InputFieldAdapter} from '../field-adapters/input';
import {NumberFieldAdapter} from '../field-adapters/number';
import {RadioFieldAdapter} from '../field-adapters/radio';
import {SelectFieldAdapter} from '../field-adapters/select';
import {FormField} from '../form-field';
import {isEmpty, hasValue} from '../utils';
import {Validators} from '../validators';


@Directive({
  selector: '[ctrlFormField]',
  exportAs: 'formField'
})
export class FormFieldDirective extends FormField implements OnDestroy, AfterViewInit, AfterViewChecked {

  private field: FieldAdapter;
  private _ctrlFormField: string;
  private errorsSubscription: Subscription;
  private _errors: ValidationError | null = null;
  private _fieldErrors: ValidationError | null = null;

  // for checkbox.
  @Input() asBoolean;
  @Input() formControl: FormControl;

  @Input() set ctrlFormField (ctrlFormField: string) {
    this._ctrlFormField = ctrlFormField;
    // support dynamic field name.
    this.signField(ctrlFormField, this.field);
  }

  get ctrlFormField() {
    return this._ctrlFormField;
  }

  @Input() set fieldValue (value: any) {
    this._value = value;
    if (this.field) {
      this.field.fieldValue = value;
    }
    this.onValueChanged(value);
  }

  get fieldValue() {
    return this._value;
  }

  constructor(private element: ElementRef,
              private changeDetector: ChangeDetectorRef,
              @Optional() @Self() @Inject(CUSTOM_FIELD) private component: FieldAdapter,
              @Optional() @SkipSelf() @Inject(FORM_CONTAINER) public parent: IFormContainer
  ) {
    super();
  }

  public ngAfterViewInit(): void {
    if (this.parent && hasValue(this.parent.fieldValue[this.ctrlFormField])) {
      // first check if the parent hold the initial value.
      this.fieldValue = this.parent.fieldValue[this.ctrlFormField];
    }

    this.field = this.getFieldAdapter(this.element, this.fieldValue);
    if (this.isCustomField(this.element)) {
      if (this.field.errorsChanged) {
        this.errorsSubscription = this.field.errorsChanged.subscribe(err => {
          this._fieldErrors = err;

          this.updateError(this.mergeErrors(this._errors, this._fieldErrors));
        });
      }
      // set default value after we registered the field so catch the error on first run.
      this.field.fieldValue = this.fieldValue;
    }
    this.signField(this.ctrlFormField, this.field);
    this.onValueChanged(this.field.fieldValue);

    this.changeDetector.detectChanges();

    this.field.valueChanged.pipe(
        distinctUntilChanged()
    ).subscribe(value => {
      this.updateValue(value);
    });
  }

  public ngOnDestroy(): void {
    this.unSignField(this.field);
    if (this.errorsSubscription) {
      this.errorsSubscription.unsubscribe();
    }
  }

  public ngAfterViewChecked(): void {
    if (this.field.fieldValue !== this._value && !this.isCustomField(this.element)) {
      this.field.fieldValue = this._value;
    }
  }

  onValueChanged(value) {
    const errors = this.checkValidity(value);
    this.updateError(errors);
  }

  public checkValidity(newValue: any): ValidationError | null {
    if (this.validators) {
      this._errors = Validators.compose(this.validators)(newValue);
    }

    return this.mergeErrors(this._errors, this._fieldErrors);
  }

  private getFieldAdapter(element: ElementRef, defaultValue) {
    if (this.formControl) {
      return new FormControlAdapter(this.formControl, defaultValue);
    }

    if (this.isCustomField(element)) {
      return this.component;
    }

    switch (element.nativeElement.type) {
      case INPUT_TYPES.TEXT:
      case INPUT_TYPES.TEXTAREA:
        return new InputFieldAdapter(element.nativeElement, defaultValue);
      case INPUT_TYPES.NUMBER:
        return new NumberFieldAdapter(element.nativeElement, defaultValue);
      case INPUT_TYPES.SELECTONE:
        return new SelectFieldAdapter(element.nativeElement, defaultValue);
      case INPUT_TYPES.RADIO:
        return new RadioFieldAdapter(element.nativeElement, defaultValue);
      case INPUT_TYPES.CHECKBOX:
        if (this.asBoolean) {
          return new BooleanCheckboxFieldAdapter(element.nativeElement, defaultValue);
        }
        return new CheckboxFieldAdapter(element.nativeElement, defaultValue);

      default:
        return new InputFieldAdapter(element.nativeElement, defaultValue);

    }
  }

  signField(fieldName: string, field: FieldAdapter) {
    if (!field || !this.parent) {return; }
    // if (!fieldName) {
    //   console.warn(` you didn't specified field name,
    //     you do that by supplying your field directive a value (e.g. <input ctrlFormField='name'>, <div al-form="myForm">)
    //     `
    //   );
    // }
    super.signField(fieldName, field);
  }

  private isCustomField(element: ElementRef) {
    return !Object.values(INPUT_TAG_NAME).includes(element.nativeElement.tagName);
  }

}
