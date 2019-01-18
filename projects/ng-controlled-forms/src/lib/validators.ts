import {ValidatorFunction, ValidationError} from './ng-controlled-forms.models';

function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}


const EMAIL_REGEXP =
          /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;


export class Validators {

  static min(min: number): ValidatorFunction {
    return (value: any): ValidationError | null => {
      if (isEmptyInputValue(value) || isEmptyInputValue(min)) {
        return null;
      }
      const aValue = parseFloat(value);
      return !isNaN(aValue) && aValue < min ? {'min': {'min': min, 'actual': aValue}} : null;
    };
  }


  static max(max: number): ValidatorFunction {
    return (value): ValidationError | null => {
      if (isEmptyInputValue(value) || isEmptyInputValue(max)) {
        return null;
      }
      const aValue = parseFloat(value);
      return !isNaN(aValue) && aValue > max ? {'max': {'max': max, 'actual': aValue}} : null;
    };
  }


  static required(value): ValidationError|null {
    return isEmptyInputValue(value) ? {'required': true} : null;
  }


  static requiredTrue(value): ValidationError|null {
    return value === true ? null : {'required': true};
  }


  static email(value): ValidationError|null {
    if (isEmptyInputValue(value)) {
      return null;  // don't validate empty values to allow optional controls
    }
    return EMAIL_REGEXP.test(value) ? null : {'email': true};
  }


  static minLength(minLength: number): ValidatorFunction {
    return (value): ValidationError | null => {
      if (isEmptyInputValue(value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      const length: number = value ? value.length : 0;
      return length < minLength ?
          {'minlength': {'requiredLength': minLength, 'actualLength': length}} :
          null;
    };
  }

  static maxLength(maxLength: number): ValidatorFunction {
    return (value): ValidationError | null => {
      const length: number = value ? value.length : 0;
      return length > maxLength ?
          {'maxlength': {'requiredLength': maxLength, 'actualLength': length}} :
          null;
    };
  }

  static pattern(pattern: string|RegExp): ValidatorFunction {
    if (!pattern) { return Validators.nullValidator; }
    let regex: RegExp;
    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = '';

      if (pattern.charAt(0) !== '^') { regexStr += '^'; }

      regexStr += pattern;

      if (pattern.charAt(pattern.length - 1) !== '$') { regexStr += '$'; }

      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return (value): ValidationError | null => {
      if (isEmptyInputValue(value)) {
        return null;  // don't validate empty values to allow optional controls
      }
      return regex.test(value) ? null :
          {'pattern': {'requiredPattern': regexStr, 'actualValue': value}};
    };
  }


  static nullValidator(value): ValidationError|null { return null; }


  static compose(validators: null): null;
  static compose(validators: (ValidatorFunction|null|undefined)[]): ValidatorFunction|null;
  static compose(validators: (ValidatorFunction|null|undefined)[]|null): ValidatorFunction|null {
    if (!validators) { return null; }
    const presentValidators: ValidatorFunction[] = validators.filter(isPresent) as any;
    if (presentValidators.length == 0) { return null; }

    return function(value) {
      return _mergeErrors(_executeValidators(value, presentValidators));
    };
  }

}

function isPresent(o: any): boolean {
  return o != null;
}


function _executeValidators(value, validators: ValidatorFunction[]): any[] {
  return validators.map(validator => validator(value));
}


function _mergeErrors(arrayOfErrors: ValidationError[]): ValidationError|null {
  const res: {[key: string]: any} =
            arrayOfErrors.reduce((res: ValidationError | null, errors: ValidationError | null) => {
              return errors != null ? {...res !, ...errors} : res !;
            }, {});
  return Object.keys(res).length === 0 ? null : res;
}
