'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const chakram = require('chakram');

suite.forElement('sageaccounting', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds(chakram.put);
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('email');
});
