'use strict';

const suite = require('core/suite');
const payload = require('./assets/bank-accounts');
const chakram = require('chakram');

suite.forElement('sageaccounting', 'bank-accounts', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
});
