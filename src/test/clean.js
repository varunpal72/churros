'use strict';

const cleaner = require('core/cleaner');
const argv = require('optimist').argv;

it(`should clean up all ${argv.resource} with name(s): ${argv.name}`, () => {
  switch (argv.resource) {
    case 'formulas':
      return cleaner.formulas.withName(argv.name);
    case 'elements':
      return cleaner.elements.withName(argv.name);
    default:
      throw Error(`Invalid resource name: ${argv.resource}`);
  }
});
