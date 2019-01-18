export function isEmpty(value: any): boolean {
  if (!value) { return true; }
  if (Array.isArray(value) && value.length === 0) {return true; }
  if (typeof value === 'object') {return Object.keys(value).length === 0; }
}

// TODO: add memo.
export function isEqual(a: any, b: any, falseEquality= true): boolean {
  // TODO: better equality check.
  if (a === b) {
    return true;
  }

  if (!falseEquality && !a && !b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  const _a = JSON.stringify(a);
  const _b = JSON.stringify(b);

  return _a === _b;
}

export function compactArray(arr) {
  return arr.filter(cell => cell);
}

export function hasValue(value: any) {
  return ![null, undefined].includes(value);
}
