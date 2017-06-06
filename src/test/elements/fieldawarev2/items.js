'use strict';

const suite = require('core/suite');
const payload = require('./assets/items');

suite.forElement('fsa', 'items', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('name');
});
