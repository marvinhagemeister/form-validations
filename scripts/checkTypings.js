const fs = require('fs');
const assert = require('assert');

const typings = fs.readFileSync(require.resolve('../dist/index.d.ts'), 'utf-8');
try {
  assert(typings.includes('declare module "form-validations'));
} catch (e) {
  console.error("ERROR: Typings do not contain 'declare module' section\n");
}
