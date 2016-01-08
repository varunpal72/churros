'use strict';

const api = require('core/util/api');
const chakram = require('chakram');
const expect = chakram.expect;
const formulasUtil = require('./formulas.util');

const schema = require('./assets/formula.schema');

describe('formulas APIs', () => {
  it('should allow cruding a simple formula', () => {
    return api.crud('/formulas', formulasUtil.gen({}), schema);
  });
});
