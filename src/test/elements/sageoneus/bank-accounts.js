'use strict';

const suite = require('core/suite');
const payload = require('./assets/bank-accounts');
const chakram = require('chakram');

suite.forElement('accounting', 'bank-accounts', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
});
