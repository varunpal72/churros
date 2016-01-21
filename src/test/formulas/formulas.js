'use strict';

const common = require('core/common');
const chakram = require('chakram');
const expect = chakram.expect;
const formulasUtil = require('./formulas.util');

const schema = require('./assets/formula.schema');

describe('formulas', () => {
  it('should allow cruding a simple formula', () => {
    return common.crud('/formulas', formulasUtil.gen({}), schema, chakram.put);
  });
});
