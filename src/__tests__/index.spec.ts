import { assert as t } from "chai";
import {
  chain,
  firstError,
  normalizeBoolean,
  oneOf,
  required,
  validBool,
  validDateFormat,
  validDateTimeFormat,
  validDateUTCFormat,
  validNumber,
  validString
} from "../index";

const hasChars = (val: string) => val.length > 0 ? true : "nope";
const isHello = (val: string) => val === "hello" ? true : "nope";

describe("chain", () => {
  it("should return [] if all validations pass", () => {
    t.deepEqual(chain(hasChars)("hello"), []);
    t.deepEqual(chain(hasChars, isHello)("hello"), []);
  });

  it("should return string[] if validation fails", () => {
    t.deepEqual(chain(hasChars)(""), ["nope"]);
    t.deepEqual(chain(hasChars, isHello)("a"), ["nope"]);
    t.deepEqual(chain(hasChars, isHello)(""), ["nope", "nope"]);
  });
});

describe("firstError", () => {
  it("should return [] if all validations pass", () => {
    t.deepEqual(firstError(hasChars)("hello"), []);
    t.deepEqual(firstError(hasChars, isHello)("hello"), []);

  });

  it("should return string[1] if validation fails", () => {
    t.deepEqual(firstError(hasChars)(""), ["nope"]);
    t.deepEqual(firstError(hasChars, isHello)("a"), ["nope"]);
    t.deepEqual(firstError(hasChars, isHello)(""), ["nope"]);
  });
});

describe("validNumber", () => {
  const test = validNumber("nope");

  it("should return default message on error", () => {
    t.equal(validNumber()("asd"), "asd is not of type number");
  });

  it("should return true on valid numbers", () => {
    t.equal(test(1), true);
    t.equal(test(-1), true);
    t.equal(test(0), true);
  });

  it("should return an error message on invalid numbers", () => {
    t.equal(test("a"), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
  });
});

describe("validString", () => {
  const test = validString("nope");

  it("should return default message on error", () => {
    t.equal(validString()(2), "2 is not of type string");
  });

  it("should return true on valid strings", () => {
    t.equal(test(""), true);
    t.equal(test("hello"), true);
  });

  it("should return an error message on invalid strings", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
  });
});

describe("validBool", () => {
  const test = validBool("nope");

  it("should return default message on error", () => {
    t.equal(validBool()(2), "2 is not of type boolean");
  });

  it("should return true on valid booleans", () => {
    t.equal(test(true), true);
    t.equal(test(false), true);
  });

  it("should return an error message on invalid booleans", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
  });
});

describe("validDateFormat", () => {
  const test = validDateFormat("nope");

  it("should return default message on error", () => {
    t.equal(validDateFormat()(2), "2 date format must be 'YYYY-MM-DD'");
  });

  it("should return true if value is YYYY-MM-DD", () => {
    t.equal(test("2016-12-06"), true);
    t.equal(test("1990-05-31"), true);
  });

  it("should return an error message if value is not YYYY-MM-DD", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
    t.equal(test(true), "nope");
    t.equal(test(false), "nope");
    t.equal(test("asdd-as-as"), "nope");
    t.equal(test("123-11-11"), "nope");
  });
});

describe("validDateTimeFormat", () => {
  const test = validDateTimeFormat("nope");

  it("should return default message on error", () => {
    t.equal(validDateTimeFormat()(2), "2 dateTime format must be 'YYYY-MM-DD hh:mm:ss'");
  });

  it("should return true if value is 'YYYY-MM-DD hh:mm:ss'", () => {
    t.equal(test("2016-12-06 22:12:00"), true);
    t.equal(test("1990-05-31 10:09:10"), true);
  });

  it("should return an error message if value is not 'YYYY-MM-DD hh:mm:ss'", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
    t.equal(test(true), "nope");
    t.equal(test(false), "nope");
    t.equal(test("asdd-as-as"), "nope");
    t.equal(test("123-11-11"), "nope");
  });
});

describe("validDateUTCFormat", () => {
  const test = validDateUTCFormat("nope");

  it("should return default message on error", () => {
    t.equal(validDateUTCFormat()(2), "2 date format must be UTC: 'YYYY-MM-DDThh:mm:ssZ'");
  });

  it("should return true if value is 'YYYY-MM-DDThh:mm:ssZ'", () => {
    t.equal(test("2016-12-06T22:12:00Z"), true);
    t.equal(test("1990-05-31T10:09:10Z"), true);
  });

  it("should return an error message if value is not 'YYYY-MM-DDThh:mm:ssZ'", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
    t.equal(test(true), "nope");
    t.equal(test(false), "nope");
    t.equal(test("asdd-as-as"), "nope");
    t.equal(test("123-11-11"), "nope");
    t.equal(test("2016-12-06 22:12:00"), "nope");
  });
});

describe("oneOf", () => {
  const test = oneOf(["single", "family"], "nope");

  it("should return default message on error", () => {
    t.equal(oneOf(["single", "family"])("a"), "'a' is not one of: 'single', 'family'");
  });

  it("should return true if value is in array", () => {
    t.equal(test("single"), true);
    t.equal(test("family"), true);
  });

  it("should return an error message if value is not single or family", () => {
    t.equal(test(1), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
    t.equal(test(true), "nope");
    t.equal(test(false), "nope");
    t.equal(test("asdd-as-as"), "nope");
    t.equal(test("123-11-11"), "nope");
    t.equal(test("2016-12-06 22:12:00"), "nope");
  });
});

describe("required", () => {
  const test = required("nope");

  it("should return default message on error", () => {
    t.equal(required()(""), "A non empty value is required");
  });

  it("should return true if value length > 0", () => {
    t.equal(test("single"), true);
    t.equal(test("family"), true);
    t.equal(test(1), true);
    t.equal(test(true), true);
    t.equal(test(false), true);
  });

  it("should return an error message if value is invalid", () => {
    t.equal(test(""), "nope");
    t.equal(test([]), "nope");
    t.equal(test({}), "nope");
    t.equal(test(null), "nope");
    t.equal(test(undefined), "nope");
  });
});

describe("normalizeBoolean", () => {
  it("should normalize to boolean", () => {
    const test = normalizeBoolean;

    t.equal(test(true), true);
    t.equal(test(false), false);
    t.equal(test(null), false);
    t.equal(test(undefined), false);
    t.equal(test(-1), false);
    t.equal(test(0), false);
    t.equal(test(1), true);
    t.equal(test(20), false);
    t.equal(test(""), false);
    t.equal(test("true"), true);
    t.equal(test("false"), false);
    t.equal(test([]), false);
    t.equal(test({}), false);

    t.throws(() => test("falsea"));
    t.throws(() => test(["asd"]));
    t.throws(() => test({ foo: "bar" }));
  });
});
