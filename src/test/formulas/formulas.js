'use strict';

const chocolate = require('core/chocolate');
const tester = require('core/tester');
const chakram = require('chakram');

const schema = require('./assets/formula.schema');

tester.for(null, 'formulas', (api) => {
  tester.testCrud(api, chocolate.genFormula({}), schema, chakram.put);
});
