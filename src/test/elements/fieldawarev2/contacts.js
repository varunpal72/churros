'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('fsa', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('firstName');
});
