'use strict';

const suite = require('core/suite');
const payload = require('./assets/credit-terms');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, payload, overrides);
const creditTerms = build({ name: tools.random()});

suite.forElement('finance', 'credit-terms', { payload: creditTerms, skip: false}, (test) => {
  test.should.supportCrs();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
});
