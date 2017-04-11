'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const options = { payload: payload };

suite.forElement('crm', 'contacts', options, (test) => {
  test.should.getRequiredFields();
  test.should.supportCruds();
  test.should.supportPagination();
  test.should.supportCeqlSearchForMultipleRecords('lastName');
});
