'use strict';

const suite = require('core/suite');
const payload = require('./assets/locations');

suite.forElement('fsa', 'locations', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('name');
});
