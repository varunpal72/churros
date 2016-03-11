'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('crm', 'contacts', payload, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
