'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('helpdesk', 'contacts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});