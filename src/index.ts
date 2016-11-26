export interface IErrorMessages {
  [key: string]: string;
}

export interface IValidator {
  (value: any): boolean | string;
}

export function chain(...args: IValidator[]) {
  return (value: any) => args.reduce((result, arg) => {
    const validOrMessage = arg(value);
    if (validOrMessage !== true) {
      result.push(validOrMessage);
    }

    return result;
  }, []);
}

export function firstError(...args: IValidator[]) {
  return (value: any) => {
    for (let i = 0; i < args.length; i++) {
      const validOrMessage = args[i](value);
      if (validOrMessage !== true) {
        return [validOrMessage];
      }
    }

    return [];
  };
}

export const isUndef = (val: any) => typeof val === "undefined";
export const isNull = (val: any) => val === null;
export const isNullOrUndef = (val: any) => isNull(val) || isUndef(val);
export const isString = (val: any) => typeof val === "string" || val instanceof String;
export const isNumber = (val: any) => typeof val === "number";
export const isBool = (val: any) => typeof val === "boolean";
export const isDate = (val: any) => /^\d{4}-\d{2}-\d{2}$/g.test(val);
export const isDateTime = (val: any) => /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/g.test(val);
export const isDateUTC = (val: any) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/g.test(val);
export const isEmpty = (val: any) =>
  (Object.keys(val).length === 0 && val.constructor === Object)
  || (Array.isArray(val) && val.length === 0)
  || (isString(val) && val.length === 0);

const messages: IErrorMessages = {
  string: " is not of type string",
  number: " is not of type number",
  bool: " is not of type boolean",
  date: " date format must be 'YYYY-MM-DD'",
  dateTime: " dateTime format must be 'YYYY-MM-DD hh:mm:ss'",
  dateUTC: " date format must be UTC: 'YYYY-MM-DDThh:mm:ssZ'",
  required: "A non empty value is required"
};

const msg = (err: string, val: any, type: string) => isUndef(err)
  ? String(val) + messages[type]
  : err;

const msgArr = (err: string, val: any, arr: any[]) => isUndef(err)
  ? "'" + String(val) + "' is not one of: '" + arr.join("', '") + "'"
  : err;

// Validators
export function validString(err?: string): IValidator {
  return val => isString(val) ? true : msg(err, val, "string");
}
export function validNumber(err?: string): IValidator {
  return val => isNumber(val) ? true : msg(err, val, "number");
}
export function validBool(err?: string): IValidator {
  return val => isBool(val) ? true : msg(err, val, "bool");
}
export function validDateFormat(err?: string): IValidator {
  return val => isString(val) && isDate(val) ? true : msg(err, val, "date");
}
export function validDateTimeFormat(err?: string): IValidator {
  return val => isString(val) && isDateTime(val) ? true : msg(err, val, "dateTime");
}
export function validDateUTCFormat(err?: string): IValidator {
  return val => isString(val) && isDateUTC(val) ? true : msg(err, val, "dateUTC");
}
export function oneOf(arr: any[], err?: string): IValidator {
  return val => !isUndef(arr.find(item => item === val)) ? true : msgArr(err, val, arr);
}
export function required(err?: string): IValidator {
  return val => !isNullOrUndef(val) && !isEmpty(val) ? true : msg(err, "", "required");
}

// Normalizers
export function normalizeBoolean(val: any): boolean {
  if (isBool(val)) {
    return val;
  }

  if (isNumber(val)) {
    return val === 1;
  }

  if (val === "true" || val === "false") {
    return JSON.parse(val); // We"re safe here because of the if statement"
  }

  return false;
}
