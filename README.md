[![Build Status](https://travis-ci.org/marvinhagemeister/form-validations.svg?branch=master)](https://travis-ci.org/marvinhagemeister/form-validations) [![NPM version](http://img.shields.io/npm/v/form-validations.svg)](https://www.npmjs.org/package/form-validations)

# Form validation in 1KB

A library that makes form validation fun again. When trying out various different
form validation libraries, I didn't found one where one could easily change
different rules, and customize the error messages as well.

Simple example:

```js
import { validString } from "form-validations";

const isString = validString("not a string"); // Simple helper for custom messages

isString("hello world!"); // Returns: []. No errors means field is valid
isString(1234); // Returns: ["not a string"]
````

A more complex example with chained validations:

```js
import { chain, validString } from "form-validations";

const isString = validString("not a string");

// Custom validator
function isHello(value) {
  if (!/hello/g.test(value)) {
    return "value does not contain 'hello'";
  }

  return true;
};

const validate = chain(isString, isHello);

validate("hello world!"); // Returns: []. No errors means field is valid
validate(1234); // Returns: ["not a string", "value does not contain 'hello'"]
```

This library was built to allow easy chaining of validations.

## API

### `chain(...validators): string[]`

Easily chain validators together. Each validator can push an error message
to the resulting array.

Example:

```js
import { chain, required, validString } from "form-validations";

// Build validators. Custom message is optional.
const isString = validString("Nope this is not a string");
const isRequired = required("This field is required");

const validator = chain(isRequired, isString);

validator(1234); // Returns ["Nope this is not a string"];
validator(null); // Returns ["This field is required", "Nope this is not a string"];
```

### `firstError(...validators): string[]`

Contrary to `chain` this function will stop at the first validator that returns
an error. The resulting string array will always have a length of 1.

Example:

```js
import { firstError, oneOf, required, validString } from "form-validations";

// Build validators
const isRelationship = oneOf(["single", "family"])
const isString = validString(); // You can use validators without a custom error message
const isRequired = required();

const validator = firstError(isRequired, isString, isRelationship);

validator(null); // Returns ["This field is required"];
```

### Available validations

Each validation function must return either `true` or an error message of type `string`.

| Validation | description |
|---|---|
| `validString` | Checks if the received value of type `string` |
| `validNumber` | Checks if the received value of type `number` |
| `validBool` | Checks if the received value of type `boolean` |
| `validDateFormat` | Checks if the received value is a string with the format: `YYYY-MM-DD` |
| `validDateTimeFormat` | Checks if the received value is a string with the format: `YYYY-MM-DD hh:mm:ss` |
| `validDateUTCFormat` | Checks if the received value is a string with the format: `YYYY-MM-DDThh:mm:ssZ` |
| `oneOf` | Checks if the received value is inside the array |
| `required` | Checks if the received value is not empty, `undefined` or `null`|

### Available normalizers

Often you need to normalize data when dealing with form elements.

```js
import { normalizeBoolean } from "form-validations";

normalizeBoolean("false"); // returns false;
normalizeBoolean(1); // returns true;
normalizeBoolean([]); // returns false;
```

| Normalize | description |
|---|---|
| `normalizeBoolean` | Returns a boolean |

## LICENSE

MIT, see `LICENSE.md`
