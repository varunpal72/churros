'use strict';

const chocolate = require('core/chocolate');
const tester = require('core/tester');
const chakram = require('chakram');
const expect = chakram.expect;

const schema = require('./assets/formula.schema');

describe('formulas', () => {
  it('should allow cruding a simple formula', () => {
    return tester.crud('/formulas', chocolate.genFormula({}), schema, chakram.put);
  });
});
