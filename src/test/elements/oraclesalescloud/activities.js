'use strict';

const suite = require('core/suite');
const payload = require('./assets/activities');

suite.forElement('crm', 'activities', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('LastName');
});
